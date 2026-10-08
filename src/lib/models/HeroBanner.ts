import mongoose, { Schema, Document } from 'mongoose';

export interface IHeroBanner extends Document {
  title: string;
  subtitle: string;
  badge: string;
  image: string;
  linkUrl: string;
  isActive: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const HeroBannerSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    subtitle: { type: String, required: true },
    badge: { type: String, default: 'Special Offer' },
    image: { type: String, required: true },
    linkUrl: { type: String, default: '/products' },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.HeroBanner || mongoose.model<IHeroBanner>('HeroBanner', HeroBannerSchema);
