import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Inquiry from '@/models/Inquiry';

export async function GET() {
    try {
        await connectDB();
        
        // Aggregate unique customers based on email
        const customers = await Inquiry.aggregate([
            {
                $group: {
                    _id: "$email",
                    name: { $first: "$name" },
                    phone: { $first: "$phone" },
                    email: { $first: "$email" },
                    totalInquiries: { $sum: 1 },
                    lastInquiry: { $max: "$createdAt" }
                }
            },
            {
                $sort: { lastInquiry: -1 }
            }
        ]);

        return NextResponse.json({ customers });
    } catch (error) {
        console.error('Fetch customers error:', error);
        return NextResponse.json({ error: 'Failed to fetch customers' }, { status: 500 });
    }
}
