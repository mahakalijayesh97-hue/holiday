import { connectDB } from '../lib/mongodb';
import User from '../models/User';

async function run() {
    await connectDB();
    console.log('Connected to DB');

    // Find any customer care user
    const cc = await User.findOne({ role: 'customer_care' });
    if (!cc) {
        console.error('No customer care user found');
        process.exit(1);
    }

    console.log('Original user:', { name: cc.name, isAvailable: cc.isAvailable });

    // Set to 0 (offline)
    cc.isAvailable = 0;
    await cc.save();
    
    // Fetch fresh from DB
    const updated = await User.findById(cc._id);
    console.log('Updated to 0:', { name: updated?.name, isAvailable: updated?.isAvailable });

    // Set to 1 (online)
    cc.isAvailable = 1;
    await cc.save();

    const updated2 = await User.findById(cc._id);
    console.log('Updated to 1:', { name: updated2?.name, isAvailable: updated2?.isAvailable });

    process.exit(0);
}

run().catch(console.error);
