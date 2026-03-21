import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import nodemailer from 'nodemailer';

export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const { name, email } = await req.json();

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        // Check if user already exists
        let user = await User.findOne({ email: email.toLowerCase() });
        const defaultPassword = 'password123';
        let isNew = false;
        
        if (!user) {
            isNew = true;
            user = await User.create({
                name: name || 'Valued Customer',
                email: email.toLowerCase(),
                password: defaultPassword,
                role: 'customer'
            });
        }

        // --- Get Dynamic Base URL ---
        const protocol = req.headers.get('x-forwarded-proto') || 'http';
        const host = req.headers.get('host');
        const baseUrl = process.env.NEXTAUTH_URL?.replace(/\/+$/, '') || `${protocol}://${host}`;

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: `"Holiday Planner" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Complete Your Registration - Holiday Planner',
            html: `
                <div style="font-family: sans-serif; background: #f4f4f4; padding: 40px; color: #333;">
                    <div style="max-width: 600px; margin: auto; background: white; padding: 40px; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.05);">
                        <h1 style="color: #8b5cf6; margin-bottom: 20px;">Welcome to Holiday Planner!</h1>
                        <p style="font-size: 16px; line-height: 1.6;">We've received your holiday inquiry and created a portal just for you. To view your itineraries and track your trip status, please complete your registration by setting up a secure password.</p>
                        
                        <div style="text-align: center; margin: 40px 0;">
                            <a href="${baseUrl}/register?email=${encodeURIComponent(email)}&name=${encodeURIComponent(name || '')}" 
                               style="display: inline-block; background: #8b5cf6; color: white; padding: 16px 40px; border-radius: 12px; text-decoration: none; font-weight: bold; font-size: 16px; box-shadow: 0 4px 14px rgba(139, 92, 246, 0.4);">
                               Complete Your Registration
                            </a>
                        </div>

                        <p style="font-size: 14px; color: #666; line-height: 1.6;">Once registered, you can log in anytime using your email address: <strong>${email}</strong></p>
                        
                        <p style="margin-top: 40px; font-size: 12px; color: #999; border-top: 1px solid #eee; padding-top: 20px;">If you didn't request this, you can safely ignore this email.</p>
                    </div>
                </div>
            `
        };

        try {
            await transporter.sendMail(mailOptions);
            return NextResponse.json({ 
                message: isNew ? 'Account created and credentials sent' : 'Account details re-sent successfully', 
                status: 'success' 
            }, { status: 200 });
        } catch (mailError: any) {
            console.error('Mail trigger failed:', mailError);
            return NextResponse.json({ 
                message: isNew ? 'Account created but email failed' : 'Failed to send email',
                details: mailError.message,
                status: 'partial_success'
            }, { status: 202 });
        }

    } catch (error: any) {
        console.error('Customer registration error:', error);
        return NextResponse.json({ error: 'Failed to process request', details: error.message }, { status: 500 });
    }
}
