import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Inquiry from '@/models/Inquiry';
import { nanoid } from 'nanoid';

// GET /api/inquiries — list all inquiries (admin)
export async function GET(req: NextRequest) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const status = searchParams.get('status');
        const assignedTo = searchParams.get('assignedTo');
        const search = searchParams.get('search');
        const email = searchParams.get('email');

        const filter: Record<string, any> = {};
        if (status) filter.status = status;
        if (assignedTo) filter.assignedTo = assignedTo;
        if (email) filter.email = email;

        // Security: If not admin/staff, only allow viewing own inquiries
        const { getServerSession } = await import('next-auth');
        const { authOptions } = await import('@/lib/auth');
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const userRole = (session.user as any)?.role;
        const userEmail = session.user?.email;

        if (userRole === 'customer') {
            // Force filter to only their own email
            filter.email = userEmail;
            // Remove other filters that might leak info
            delete filter.assignedTo;
            if (filter.$or) delete filter.$or;
        }

        if (search && userRole !== 'customer') {
            filter.$or = [
                { inquiryId: { $regex: search, $options: 'i' } },
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { phone: { $regex: search, $options: 'i' } },
            ];
        }

        const inquiries = await Inquiry.find(filter)
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

        return NextResponse.json({ inquiry, inquiryId }, { status: 201 });
    } catch (error) {
        console.error('POST inquiry error:', error);
        return NextResponse.json({ error: 'Failed to save inquiry' }, { status: 500 });
    }
}
