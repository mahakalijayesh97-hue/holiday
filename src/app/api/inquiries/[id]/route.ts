import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Inquiry from '@/models/Inquiry';

export async function GET(
    req: Request, 
    { params }: { params: Promise<{ id: string }> } 
) {
    try {
        const { id } = await params;
        await connectDB();
        const inquiry = await Inquiry.findById(id).populate('assignedTo', 'name email role');
        if (!inquiry) return NextResponse.json({ error: 'Inquiry not found' }, { status: 404 });
        return NextResponse.json({ inquiry });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch inquiry' }, { status: 500 });
    }
}

export async function PATCH(
    req: Request, 
    { params }: { params: Promise<{ id: string }> } 
) {
    try {
        const { id } = await params;
        await connectDB();
        const body = await req.json();
        const { status, assignedTo, note, noteAuthor, meeting } = body;

        const inquiry = await Inquiry.findById(id);
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
        const updatedInquiry = await Inquiry.findById(id).populate('assignedTo', 'name email role');
        return NextResponse.json({ inquiry: updatedInquiry });
    } catch (error) {
        console.error('PATCH inquiry error:', error);
        return NextResponse.json({ error: 'Failed to update inquiry' }, { status: 500 });
    }
}
