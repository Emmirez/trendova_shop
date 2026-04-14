import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  name: String,
  price: Number,
  quantity: Number,
  size: String,
  image: String,
});

const statusHistorySchema = new mongoose.Schema({
  status: String,
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  notes: String,
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      unique: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    customer: {
      name: String,
      email: String,
      phone: String,
    },
    shippingAddress: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: { type: String, default: 'Nigeria' },
    },
    items: [orderItemSchema],
    subtotal: Number,
    shippingFee: {
      type: Number,
      default: 0,
    },
    total: Number,
    paymentMethod: {
      type: String,
      enum: ['card', 'bank', 'wallet'],
      default: 'card',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending',
    },
    paymentReference: String,
    orderStatus: {
      type: String,
      enum: ['pending_payment', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending_payment',
    },
    statusHistory: [statusHistorySchema],
    estimatedDeliveryDate: Date,
    deliveredAt: Date,
    notes: String,
  },
  {
    timestamps: true,
  }
);

// Generate order number before saving
orderSchema.pre('save', async function() {
  if (!this.orderNumber) {
    const timestamp = Date.now().toString().slice(-8);
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    this.orderNumber = `TRV-${timestamp}${random}`;
  }
});

const Order = mongoose.model('Order', orderSchema);

export default Order;