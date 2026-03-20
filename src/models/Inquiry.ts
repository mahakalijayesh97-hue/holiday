import mongoose, { Schema, Document } from 'mongoose';

export interface IDayPlan {
    day: number;
    title: string;
    places: string[];
    route: string;
    activities: string[];
}

export interface ITravelPlan {
    id: string;
    title: string;
    description: string;
    budget: 'low' | 'medium' | 'high';
    estimatedCost: string;
    days: IDayPlan[];
    highlights: string[];
    bestFor: string;
}

export interface INote {
    text: string;
    author: string;
    createdAt: Date;
}

export interface IMeeting {
    scheduledAt: Date;
    notes: string;
    createdAt: Date;
}

export interface IInquiry extends Document {
    inquiryId: string;
    name: string;
    phone: string;
    email: string;
    destination: string;
    days: number;
    selectedPlan: ITravelPlan;
    status: 'Pending' | 'In Progress' | 'Completed';
    assignedTo?: mongoose.Types.ObjectId;
    notes: INote[];
    meetings: IMeeting[];
    createdAt: Date;
    updatedAt: Date;
}

const DayPlanSchema = new Schema({
    day: Number,
    title: String,
    places: [String],
    route: String,
    activities: [String],
});

const TravelPlanSchema = new Schema({
    id: String,
    title: String,
    description: String,
    budget: { type: String, enum: ['low', 'medium', 'high'] },
    estimatedCost: String,
    days: [DayPlanSchema],
    highlights: [String],
    bestFor: String,
});

const NoteSchema = new Schema({
    text: String,
    author: String,
    createdAt: { type: Date, default: Date.now },
});

const MeetingSchema = new Schema({
    scheduledAt: Date,
    notes: String,
    createdAt: { type: Date, default: Date.now },
});

const InquirySchema = new Schema<IInquiry>(
    {
        inquiryId: { type: String, required: true, unique: true },
        name: { type: String, required: true },
        phone: { type: String, required: true },
        email: { type: String, required: true },
        destination: { type: String, required: true },
        days: { type: Number, required: true },
        selectedPlan: TravelPlanSchema,
        status: {
            type: String,
            enum: ['Pending', 'In Progress', 'Completed'],
            default: 'Pending',
        },
        assignedTo: { type: Schema.Types.ObjectId, ref: 'User', default: null },
        notes: [NoteSchema],
        meetings: [MeetingSchema],
    },
    { timestamps: true }
);

export default mongoose.models.Inquiry || mongoose.model<IInquiry>('Inquiry', InquirySchema);
