import mongoose, { Schema, Document } from 'mongoose';

export interface IHotel {
  name: string;
  costPerNight: string;
}

export interface IDestination extends Document {
  name: string; // internal id, e.g., 'ahmedabad'
  displayName: string; // 'Ahmedabad'
  district?: string;
  region?: string;
  morning: string;
  afternoon: string;
  evening: string;
  highlights: string[];
  type: string; // 'gujarat' | 'global' | other
  hotels: {
    budget: IHotel[];
    comfort: IHotel[];
    luxury: IHotel[];
  };
  createdAt: Date;
  updatedAt: Date;
}

const HotelSchema = new Schema({
  name: { type: String, required: true },
  costPerNight: { type: String, required: true },
});

const DestinationSchema = new Schema<IDestination>(
  {
    name: { type: String, required: true, unique: true },
    displayName: { type: String, required: true },
    district: { type: String },
    region: { type: String },
    morning: { type: String, required: true },
    afternoon: { type: String, required: true },
    evening: { type: String, required: true },
    highlights: { type: [String], default: [] },
    type: { type: String, required: true, default: 'gujarat' },
    hotels: {
      budget: [HotelSchema],
      comfort: [HotelSchema],
      luxury: [HotelSchema],
    },
  },
  { timestamps: true }
);

export default mongoose.models.Destination || mongoose.model<IDestination>('Destination', DestinationSchema);
