import mongoose, { Schema, Document } from 'mongoose';

export interface IVendor extends Document {
  name: string;
  slug: string;
  description: string;
  logo: string;
  contactEmail: string;
  contactPhone: string;
  whatsappNumber: string;
  address: {
    street: string;
    city: string;
    province: string;
    postalCode: string;
  };
  commissionRate: number;
  isActive: boolean;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const VendorSchema = new Schema<IVendor>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, default: '' },
    logo: { type: String, default: '' },
    contactEmail: { type: String, required: true },
    contactPhone: { type: String, required: true },
    whatsappNumber: { type: String, required: true },
    address: {
      street: { type: String, default: '' },
      city: { type: String, default: 'Kandy' },
      province: { type: String, default: 'Central' },
      postalCode: { type: String, default: '' },
    },
    commissionRate: { type: Number, default: 0, min: 0, max: 100 },
    isActive: { type: Boolean, default: true },
    isVerified: { type: Boolean, default: true },
  },
  { timestamps: true }
);

VendorSchema.index({ slug: 1 });
VendorSchema.index({ isActive: 1 });

export default mongoose.models.Vendor || mongoose.model<IVendor>('Vendor', VendorSchema);
