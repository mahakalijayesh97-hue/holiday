import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const session = await getServerSession(authOptions);
        const isSelf = session && (session.user as any).id === id;
        const isAdmin = session && (session.user as any).role === 'admin';
        if (!session || (!isAdmin && !isSelf)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();
        const user = await User.findById(id).select('-password');
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({ user });
    } catch (error) {
        console.error('GET user error:', error);
        return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 });
    }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const session = await getServerSession(authOptions);
        const isSelf = session && (session.user as any).id === id;
        const isAdmin = session && (session.user as any).role === 'admin';
        if (!session || (!isAdmin && !isSelf)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { name, email, role, password, phoneNumber, assignedLocations, assignedAreas, isAvailable } = body;

        await connectDB();
        const user = await User.findById(id);
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }
        const wasAvailable = user.isAvailable === 1;
        let targetAvailability: number | undefined = undefined;
        if (isAvailable !== undefined) {
            targetAvailability = (isAvailable === true || isAvailable === 1) ? 1 : 0;
        }
        const goingOffline = wasAvailable && targetAvailability === 0;

        if (isAdmin) {
            user.name = name || user.name;
            user.email = email || user.email;
            user.role = role || user.role;
            if (phoneNumber !== undefined) user.phoneNumber = phoneNumber;
            if (assignedLocations !== undefined) user.assignedLocations = assignedLocations;
            if (assignedAreas !== undefined) user.assignedAreas = assignedAreas;
            if (targetAvailability !== undefined) user.isAvailable = targetAvailability;
            if (password) {
                user.password = password; // Pre-save hook will hash this
            }
        } else {
            // Customer care user can only update their availability
            if (targetAvailability !== undefined) {
                user.isAvailable = targetAvailability;
            }
        }

        await user.save();

        if (targetAvailability === 1) {
            const { checkAndReassignExpiredInquiries } = await import('@/lib/assignment');
            await checkAndReassignExpiredInquiries();
        } else if (goingOffline) {
            const { releaseAgentInquiries } = await import('@/lib/assignment');
            await releaseAgentInquiries(id);
        }

        return NextResponse.json({ message: 'User updated successfully', isAvailable: user.isAvailable });
    } catch (error) {
        console.error('Update user error:', error);
        return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any).role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Prevent deleting yourself
        if (id === (session.user as any).id) {
            return NextResponse.json({ error: 'Cannot delete your own account' }, { status: 400 });
        }

        await connectDB();
        const user = await User.findByIdAndDelete(id);
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Delete user error:', error);
        return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
    }
}
