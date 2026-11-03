import mongoose, { Schema, Document } from 'mongoose';

export interface IHeroBanner extends Document {
  title: string;
  subtitle: string;
  badge: string;
  discountText?: string;
  ctaText?: string;
  bgTheme?: string;
  displayMode?: 'daraz-stage' | 'full-image';
  image: string;
  secondaryImages?: string[];
  linkUrl: string;
  isActive: boolean;
  order: number;
  startDate?: string;
  endDate?: string;
  createdAt: Date;
  updatedAt: Date;
}

const HeroBannerSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    subtitle: { type: String, required: true },
    badge: { type: String, default: '11.11 SHOPPING FEST' },
    discountText: { type: String, default: '65%' },
    ctaText: { type: String, default: 'Shop Now' },
    bgTheme: { type: String, default: 'blue' },
    displayMode: { type: String, default: 'daraz-stage' },
    image: { type: String, required: true },
    secondaryImages: { type: [String], default: [] },
    linkUrl: { type: String, default: '/products' },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 1 },
    startDate: { type: String, default: '' },
    endDate: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.models.HeroBanner || mongoose.model<IHeroBanner>('HeroBanner', HeroBannerSchema);
