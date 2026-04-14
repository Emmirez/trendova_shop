import mongoose from 'mongoose';

const replySchema = new mongoose.Schema({
  from: {
    type: String,
    required: true,
    enum: ['user', 'support', 'You', 'Trendova Support'],
  },
  text: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    default: () => new Date().toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    }),
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, { _id: true });

const ticketSchema = new mongoose.Schema({
  ticketId: {
    type: String,
    unique: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  userEmail: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: String,
    required: true,
    enum: ['Order Issue', 'Return & Refund', 'Product Inquiry', 'Payment Issue', 'Shipping Query', 'Other'],
  },
  priority: {
    type: String,
    required: true,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium',
  },
  status: {
    type: String,
    required: true,
    enum: ['Open', 'In Progress', 'Resolved', 'Closed'],
    default: 'Open',
  },
  message: {
    type: String,
    required: true,
  },
  replies: [replySchema],
  date: {
    type: String,
    default: () => new Date().toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    }),
  },
}, {
  timestamps: true,
});

// Generate ticket ID before saving
ticketSchema.pre('save', async function(next) {
  if (!this.ticketId) {
    const count = await mongoose.model('Ticket').countDocuments();
    this.ticketId = `TKT-${String(count + 1).padStart(3, '0')}`;
  }
});

const Ticket = mongoose.model('Ticket', ticketSchema);

export default Ticket;