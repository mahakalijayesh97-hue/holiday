import { connectDB } from './mongodb';
import User, { IUser } from '@/models/User';
import Inquiry, { IInquiry } from '@/models/Inquiry';
import Destination from '@/models/Destination';
import mongoose from 'mongoose';

/**
 * Assigns an inquiry to an available Customer Care agent based on location and area.
 * Uses an atomic findOneAndUpdate to claim the inquiry before processing,
 * preventing race conditions / duplicate assignments.
 */
export async function assignInquiryToAgent(inquiry: IInquiry): Promise<boolean> {
    await connectDB();

    // --- Atomic lock: mark the inquiry as "being reassigned" so concurrent calls skip it ---
    // We use findOneAndUpdate with a condition so only ONE process wins the lock.
    const locked = await Inquiry.findOneAndUpdate(
        {
            _id: inquiry._id,
            // Only lock if it is still in a state that needs assignment:
            // unassigned  OR  expired-and-not-accepted
            $or: [
                { assignedTo: null },
                {
                    assignedTo: { $ne: null },
                    assignmentAccepted: { $ne: true },
                    assignmentExpiresAt: { $lt: new Date() }
                }
            ]
        },
        // Set a short-lived "processing" window so we hold the lock while we work
        { $set: { assignmentExpiresAt: new Date(Date.now() + 10_000) } },
        { new: false } // return the OLD doc so we know we actually won the lock
    );

    if (!locked) {
        // Another process already locked / assigned this inquiry — skip it
        console.log(`Inquiry ${inquiry.inquiryId} is already being processed. Skipping.`);
        return false;
    }

    // --- Resolve destination ---
    let location = inquiry.destination;
    let area = inquiry.destination;

    const destDoc = await Destination.findOne({
        $or: [
            { name: inquiry.destination.toLowerCase() },
            { displayName: new RegExp('^' + inquiry.destination + '$', 'i') }
        ]
    });

    if (destDoc) {
        location = destDoc.displayName;
        area = destDoc.region || destDoc.type || destDoc.displayName;
    }

    // --- Find eligible agents (online + matching location/area) ---
    const eligibleAgents = await User.find({
        role: 'customer_care',
        isAvailable: 1,
        $or: [
            { assignedLocations: location },
            { assignedAreas: area }
        ]
    });

    if (eligibleAgents.length === 0) {
        console.log(`No eligible agents for ${location} / ${area}. Clearing assignment.`);
        await Inquiry.findByIdAndUpdate(inquiry._id, {
            $set: {
                assignedTo: null,
                assignmentExpiresAt: null,
                assignmentAccepted: false
            }
        });
        return false;
    }

    // --- Filter out previously tried agents, cycle if all tried ---
    const previouslyTriedIds = (inquiry.previouslyAssignedTo || []).map(id => id.toString());
    let candidates = eligibleAgents.filter(
        agent => !previouslyTriedIds.includes(agent._id.toString())
    );

    if (candidates.length === 0) {
        // All eligible agents have been tried — reset the cycle
        await Inquiry.findByIdAndUpdate(inquiry._id, {
            $set: { previouslyAssignedTo: [] }
        });
        candidates = eligibleAgents;
    }

    // --- Round-robin: pick the agent least recently assigned ---
    candidates.sort((a, b) => {
        const timeA = a.lastAssignedAt ? new Date(a.lastAssignedAt).getTime() : 0;
        const timeB = b.lastAssignedAt ? new Date(b.lastAssignedAt).getTime() : 0;
        return timeA - timeB;
    });

    const selectedAgent = candidates[0];

    // --- Commit the real assignment atomically ---
    await Inquiry.findByIdAndUpdate(inquiry._id, {
        $set: {
            assignedTo: selectedAgent._id,
            assignmentExpiresAt: new Date(Date.now() + 30_000), // 30-second window
            assignmentAccepted: false
        },
        $addToSet: {
            previouslyAssignedTo: selectedAgent._id
        }
    });

    await User.findByIdAndUpdate(selectedAgent._id, {
        $set: { lastAssignedAt: new Date() }
    });

    console.log(
        `Assigned inquiry ${inquiry.inquiryId} → agent ${selectedAgent.name} (expires in 30s)`
    );
    return true;
}

/**
 * Checks all pending inquiries and reassigns any that:
 *  - are unassigned (assignedTo === null), OR
 *  - have an expired acceptance window and were not accepted
 *
 * Safe to call concurrently — the atomic lock inside assignInquiryToAgent prevents duplicates.
 */
export async function checkAndReassignExpiredInquiries(): Promise<void> {
    try {
        await connectDB();
        const now = new Date();

        const staleInquiries = await Inquiry.find({
            status: 'Pending',
            $or: [
                { assignedTo: null },
                {
                    assignedTo: { $ne: null },
                    assignmentAccepted: { $ne: true },
                    assignmentExpiresAt: { $lt: now }
                }
            ]
        });

        if (staleInquiries.length > 0) {
            console.log(
                `Found ${staleInquiries.length} stale inquiries. Reassigning...`
            );
            // Run sequentially to reduce DB contention; the atomic lock still protects parallel callers
            for (const inquiry of staleInquiries) {
                await assignInquiryToAgent(inquiry);
            }
        }
    } catch (error) {
        console.error('Error in checkAndReassignExpiredInquiries:', error);
    }
}

/**
 * Called when an agent goes OFFLINE (isAvailable → false).
 * Clears any pending (not-yet-accepted) assignments on this agent
 * and immediately tries to reassign those inquiries to someone else.
 */
export async function releaseAgentInquiries(agentId: string): Promise<void> {
    try {
        await connectDB();

        // Find inquiries assigned to this agent that are still pending acceptance
        const pendingForAgent = await Inquiry.find({
            assignedTo: new mongoose.Types.ObjectId(agentId),
            assignmentAccepted: { $ne: true },
            status: 'Pending'
        });

        if (pendingForAgent.length === 0) return;

        console.log(
            `Agent ${agentId} went offline. Releasing ${pendingForAgent.length} pending inquiry/inquiries.`
        );

        for (const inquiry of pendingForAgent) {
            // Clear the current assignment so the atomic lock can pick it up
            await Inquiry.findByIdAndUpdate(inquiry._id, {
                $set: {
                    assignedTo: null,
                    assignmentExpiresAt: null,
                    assignmentAccepted: false
                }
            });
            // Immediately try to find a new agent
            await assignInquiryToAgent(inquiry);
        }
    } catch (error) {
        console.error('Error releasing agent inquiries on offline:', error);
    }
}
