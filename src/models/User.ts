import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
    name: string;
    email: string;
    phoneNumber?: string;
    password: string;
    role: 'admin' | 'customer_care' | 'customer';
    comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true, lowercase: true },
        phoneNumber: { type: String },
        password: { type: String, required: true },
        role: { type: String, enum: ['admin', 'customer_care', 'customer'], default: 'customer' },
    },
    { timestamps: true }
);

UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

UserSchema.methods.comparePassword = async function (candidatePassword: string) {
    return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

// Force refresh in case of enum changes during dev
if (process.env.NODE_ENV === 'development') {
    delete (mongoose.models as any).User;
}

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
