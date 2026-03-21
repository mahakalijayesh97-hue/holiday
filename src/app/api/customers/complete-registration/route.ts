import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const { name, email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
        }

        // Find existing user or create one
        let user = await User.findOne({ email: email.toLowerCase() });
        
        if (user) {
            // Update existing user with new details and mark as customer
            user.name = name || user.name;
            user.password = password; // Pre-save hook will hash this
            user.role = 'customer';
            await user.save();
        } else {
            // Create a new user if not exist (e.g. from direct link)
            user = await User.create({
                name: name || 'Valued Customer',
                email: email.toLowerCase(),
                password,
                role: 'customer'
            });
        }

        return NextResponse.json({ 
            message: 'Registration completed successfully', 
            user: { name: user.name, email: user.email, role: user.role } 
        }, { status: 200 });

    } catch (error: any) {
        console.error('Complete registration error:', error);
        return NextResponse.json({ error: 'Failed to complete registration', details: error.message }, { status: 500 });
    }
}
