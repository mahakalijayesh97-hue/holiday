import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Inquiry from '@/models/Inquiry';
import { nanoid } from 'nanoid';
import { assignInquiryToAgent, checkAndReassignExpiredInquiries } from '@/lib/assignment';

// GET /api/inquiries — list all inquiries (admin)
export async function GET(req: NextRequest) {
    try {
        await connectDB();
        await checkAndReassignExpiredInquiries();
        const { searchParams } = new URL(req.url);
        const status = searchParams.get('status');
        const assignedTo = searchParams.get('assignedTo');
        const search = searchParams.get('search');
        const email = searchParams.get('email');

        const { getServerSession } = await import('next-auth');
        const { authOptions } = await import('@/lib/auth');
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const userRole = (session.user as any)?.role;
        const userEmail = session.user?.email;

        const conditions: any[] = [];

        // Base query parameters
        const baseFilter: Record<string, any> = {};
        if (status) baseFilter.status = status;
        if (assignedTo) baseFilter.assignedTo = assignedTo;
        if (email) baseFilter.email = email;

        if (Object.keys(baseFilter).length > 0) {
            conditions.push(baseFilter);
        }

        // Security role filtering
        if (userRole === 'customer') {
            conditions.push({ email: userEmail });
        } else if (userRole === 'customer_care') {
            const User = (await import('@/models/User')).default;
            const Destination = (await import('@/models/Destination')).default;
            const userDoc = await User.findById((session.user as any).id);
            if (userDoc) {
                const allowedDestinations = await Destination.find({
                    $or: [
                        { displayName: { $in: userDoc.assignedLocations || [] } },
                        { region: { $in: userDoc.assignedAreas || [] } },
                        { type: { $in: userDoc.assignedAreas || [] } }
                    ]
                });
                
                const allowedNames = allowedDestinations.map(d => d.displayName);
                const allowedSlugs = allowedDestinations.map(d => d.name);
                const allAllowed = Array.from(new Set([
                    ...allowedNames,
                    ...allowedSlugs,
                    ...(userDoc.assignedLocations || [])
                ]));
                
                const caseInsensitiveRegex = allAllowed.map(name => new RegExp('^' + name + '$', 'i'));
                
                conditions.push({
                    $or: [
                        { assignedTo: (session.user as any).id },
                        { destination: { $in: caseInsensitiveRegex } }
                    ]
                });
            }
        }

        // Search parameter filtering
        if (search && userRole !== 'customer') {
            conditions.push({
                $or: [
                    { inquiryId: { $regex: search, $options: 'i' } },
                    { name: { $regex: search, $options: 'i' } },
                    { email: { $regex: search, $options: 'i' } },
                    { phone: { $regex: search, $options: 'i' } },
                ]
            });
        }

        const query = conditions.length > 0 ? { $and: conditions } : {};
        const inquiries = await Inquiry.find(query)
            .populate('assignedTo', 'name email role')
            .sort({ createdAt: -1 });

        return NextResponse.json({ inquiries });
    } catch (error) {
        console.error('GET inquiries error:', error);
        return NextResponse.json({ error: 'Failed to fetch inquiries' }, { status: 500 });
    }
}

// POST /api/inquiries — save a new inquiry
export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const body = await req.json();
        const { name, phone, email, destination, days, selectedPlan } = body;

        if (!name || !phone || !email || !destination || !days || !selectedPlan) {
            return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
        }

        const inquiryId = `HP-${nanoid(8).toUpperCase()}`;

        const inquiry = await Inquiry.create({
            inquiryId,
            name,
            phone,
            email,
            destination,
            days,
            selectedPlan,
            status: 'Pending',
        });

        await assignInquiryToAgent(inquiry);

        return NextResponse.json({ inquiry, inquiryId }, { status: 201 });
    } catch (error) {
        console.error('POST inquiry error:', error);
        return NextResponse.json({ error: 'Failed to save inquiry' }, { status: 500 });
    }
}
