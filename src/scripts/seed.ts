import { connectDB } from '../lib/mongodb';
import User from '../models/User';
import Inquiry from '../models/Inquiry';
import { generateMockPlans } from '../lib/mockPlans';
import { nanoid } from 'nanoid';

async function seed() {
    console.log('🚀 Starting official seed...');
    await connectDB();

    // Seed users
    await User.deleteMany({});

    // Pass PLAIN passwords; let the User model's pre-save hook handle the hashing
    const admin = await User.create({
        name: 'Admin User',
        email: 'admin@travel.com',
        password: 'admin123',
        role: 'admin'
    });

    const cc = await User.create({
        name: 'Sarah Johnson',
        email: 'sarah@travel.com',
        password: 'care123',
        role: 'customer_care'
    });

    console.log('✅ Seeded users (Hashed via Mongoose hook)');

    // Seed inquiries
    await Inquiry.deleteMany({});
    const plans = generateMockPlans('Paris', 5);
    await Inquiry.create([
        {
            inquiryId: `HP-${nanoid(8).toUpperCase()}`,
            name: 'Rahul Sharma', phone: '9876543210', email: 'rahul@example.com',
            destination: 'Paris', days: 5, selectedPlan: plans[1], status: 'Pending',
        },
        {
            inquiryId: `HP-${nanoid(8).toUpperCase()}`,
            name: 'Priya Mehta', phone: '9123456780', email: 'priya@example.com',
            destination: 'Bali', days: 7, selectedPlan: generateMockPlans('Bali', 7)[2], status: 'In Progress',
            assignedTo: cc._id, notes: [{ text: 'Customer interested in beach resorts', author: 'Sarah Johnson', createdAt: new Date() }],
        },
    ]);

    console.log('✅ Seeded inquiries');
    console.log('\n🌍 Seed complete!');
    console.log('Admin login: admin@travel.com / admin123');
    console.log('Customer Care login: sarah@travel.com / care123');
    process.exit(0);
}

seed().catch((err) => {
    console.error('❌ Seed failed:', err);
    process.exit(1);
});
