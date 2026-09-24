import mongoose, { Schema, Document } from 'mongoose';

export interface IOrderItem {
  product: mongoose.Types.ObjectId;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface IOrder extends Document {
  orderNumber: string;
  customer: {
    name: string;
    phone: string;
    email: string;
    address: {
      street: string;
      city: string;
      province: string;
      postalCode: string;
    };
  };
  items: IOrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  paymentMethod: 'cod' | 'whatsapp';
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  vendor: mongoose.Types.ObjectId;
  notes: string;
  whatsappSent: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema<IOrder>(
  {
    orderNumber: { type: String, required: true, unique: true },
    customer: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      email: { type: String, default: '' },
      address: {
        street: { type: String, required: true },
        city: { type: String, required: true },
        province: { type: String, default: 'Central' },
        postalCode: { type: String, default: '' },
      },
    },
    items: [
      {
        product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true, min: 1 },
        image: { type: String, default: '' },
      },
    ],
    subtotal: { type: Number, required: true },
    deliveryFee: { type: Number, default: 0 },
    total: { type: Number, required: true },
    paymentMethod: {
      type: String,
      required: true,
      enum: ['cod', 'whatsapp'],
    },
    status: {
      type: String,
      default: 'pending',
      enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
    },
    vendor: { type: Schema.Types.ObjectId, ref: 'Vendor', required: true },
    notes: { type: String, default: '' },
    whatsappSent: { type: Boolean, default: false },
  },
  { timestamps: true }
);

OrderSchema.index({ orderNumber: 1 });
OrderSchema.index({ status: 1 });
OrderSchema.index({ vendor: 1 });
OrderSchema.index({ createdAt: -1 });
OrderSchema.index({ 'customer.phone': 1 });

// Auto-generate order number
OrderSchema.pre('validate', async function () {
  if (!this.orderNumber) {
    const count = await mongoose.models.Order.countDocuments();
    this.orderNumber = `AZ-${String(count + 1001).padStart(6, '0')}`;
  }
});

export default mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);
