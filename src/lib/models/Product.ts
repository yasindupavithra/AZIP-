import mongoose, { Schema, Document } from 'mongoose';

export type ProductCategory =
  | 'books'
  | 'school-books'
  | 'exercise-books'
  | 'writing-instruments'
  | 'mathematical-instruments'
  | 'art-craft'
  | 'office-supplies'
  | 'school-accessories'
  | 'files-organization'
  | 'educational-materials'
  | 'preschool-kids'
  | 'science-laboratory'
  | 'gifts-accessories'
  | 'electronics';

export interface IProduct extends Document {
  vendor: mongoose.Types.ObjectId;
  name: string;
  slug: string;
  description: string;
  category: ProductCategory;
  subcategory: string;
  price: number;
  compareAtPrice: number;
  images: Array<{
    url: string;
    publicId: string;
    alt: string;
  }>;
  stock: number;
  sku: string;
  tags: string[];
  specifications: Map<string, string>;
  isActive: boolean;
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    vendor: { type: Schema.Types.ObjectId, ref: 'Vendor', required: true },
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, default: '' },
    category: {
      type: String,
      required: true,
      enum: [
        'books',
        'school-books',
        'exercise-books',
        'writing-instruments',
        'mathematical-instruments',
        'art-craft',
        'office-supplies',
        'school-accessories',
        'files-organization',
        'educational-materials',
        'preschool-kids',
        'science-laboratory',
        'gifts-accessories',
        'electronics',
      ],
    },
    subcategory: { type: String, default: '' },
    price: { type: Number, required: true, min: 0 },
    compareAtPrice: { type: Number, default: 0, min: 0 },
    images: [
      {
        url: { type: String, required: true },
        publicId: { type: String, default: '' },
        alt: { type: String, default: '' },
      },
    ],
    stock: { type: Number, required: true, default: 0, min: 0 },
    sku: { type: String, default: '' },
    tags: [{ type: String }],
    specifications: {
      type: Map,
      of: String,
      default: new Map(),
    },
    isActive: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

ProductSchema.index({ category: 1, isActive: 1 });
ProductSchema.index({ slug: 1 });
ProductSchema.index({ vendor: 1 });
ProductSchema.index({ name: 'text', description: 'text', tags: 'text' });
ProductSchema.index({ price: 1 });
ProductSchema.index({ isFeatured: 1, isActive: 1 });

export default mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);
