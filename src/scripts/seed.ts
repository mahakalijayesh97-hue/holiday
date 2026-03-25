import { connectDB } from '../lib/mongodb';
import User from '../models/User';
import Inquiry from '../models/Inquiry';
import Destination from '../models/Destination';
import { generateMockPlans, GUJARAT_CITY_DATA, GLOBAL_CITY_DATA } from '../lib/mockPlans';
import { nanoid } from 'nanoid';

async function seed() {
    console.log('Starting official seed...');
    await connectDB();

    // 1. Seed users
    await User.deleteMany({});
    const admin = await User.create({
        name: 'Admin User',
        email: 'admin@gmail.com',
        phoneNumber: '9876543210',
        password: 'admin123',
        role: 'admin'
    });

    const cc = await User.create({
        name: 'Sarah Johnson',
        email: 'sarah@travel.com',
        phoneNumber: '9123456789',
        password: 'care123',
        role: 'customer_care'
    });
    console.log('Seeded users');

    // 2. Seed destinations
    await Destination.deleteMany({});
    const gujaratDestinations = Object.entries(GUJARAT_CITY_DATA).map(([key, data]) => ({
        name: key,
        displayName: data.district,
        district: data.district,
        region: data.region,
        morning: data.morning,
        afternoon: data.afternoon,
        evening: data.evening,
        highlights: data.highlights,
        type: 'Gujarat',
        hotels: data.hotels
    }));

    const globalDestinations = Object.entries(GLOBAL_CITY_DATA).map(([key, data]) => ({
        name: key,
        displayName: key.charAt(0).toUpperCase() + key.slice(1),
        morning: data.morning,
        afternoon: data.afternoon,
        evening: data.evening,
        highlights: data.highlights,
        type: 'Global',
        hotels: {
            budget: [],
            comfort: [],
            luxury: []
        }
    }));

    await Destination.insertMany([...gujaratDestinations, ...globalDestinations]);
    console.log('Seeded destinations');

    // 3. Seed inquiries
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

    console.log('Seeded inquiries');
    console.log('\n Seed complete!');
    console.log('Admin login: admin@travel.com / admin123');
    console.log('Customer Care login: sarah@travel.com / care123');
    process.exit(0);
}

seed().catch((err) => {
    console.error('Seed failed:', err);
    process.exit(1);
});
