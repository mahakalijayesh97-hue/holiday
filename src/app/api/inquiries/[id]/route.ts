import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Inquiry from '@/models/Inquiry';
import User from '@/models/User';

// GET /api/inquiries/[id]
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        await connectDB();
        const inquiry = await Inquiry.findById(params.id).populate('assignedTo', 'name email role');
        if (!inquiry) return NextResponse.json({ error: 'Inquiry not found' }, { status: 404 });
        return NextResponse.json({ inquiry });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch inquiry' }, { status: 500 });
    }
}

// PATCH /api/inquiries/[id] — update status, assign, add note, add meeting
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        await connectDB();
        const body = await req.json();
        const { status, assignedTo, note, noteAuthor, meeting } = body;

        const inquiry = await Inquiry.findById(params.id);
        if (!inquiry) return NextResponse.json({ error: 'Inquiry not found' }, { status: 404 });

        if (status) inquiry.status = status;
        if (assignedTo !== undefined) inquiry.assignedTo = assignedTo || null;

        if (note) {
            inquiry.notes.push({ text: note, author: noteAuthor || 'Admin', createdAt: new Date() });
        }

        if (meeting) {
            inquiry.meetings.push({
                scheduledAt: new Date(meeting.scheduledAt),
                notes: meeting.notes || '',
                createdAt: new Date(),
            });
        }

        await inquiry.save();
        const updatedInquiry = await Inquiry.findById(params.id).populate('assignedTo', 'name email role');
        return NextResponse.json({ inquiry: updatedInquiry });
    } catch (error) {
        console.error('PATCH inquiry error:', error);
        return NextResponse.json({ error: 'Failed to update inquiry' }, { status: 500 });
    }
}
