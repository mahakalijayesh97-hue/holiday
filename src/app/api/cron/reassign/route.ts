import { NextRequest, NextResponse } from 'next/server';
import { checkAndReassignExpiredInquiries } from '@/lib/assignment';

export const runtime = 'nodejs'; // ensure full Node.js runtime for DB access

export async function GET(req: NextRequest) {
    const secret = req.headers.get('x-cron-secret') ?? req.nextUrl.searchParams.get('secret');

    // Reject unauthenticated calls in production
    if (
        process.env.NODE_ENV === 'production' &&
        secret !== process.env.CRON_SECRET
    ) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        await checkAndReassignExpiredInquiries();
        return NextResponse.json({ ok: true, timestamp: new Date().toISOString() });
    } catch (error) {
        console.error('Cron reassign error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
