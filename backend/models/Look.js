import mongoose from 'mongoose';

const lookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    enum: ['The Night Out', 'The Street Edit'],
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  products: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
  }],
  isActive: {
    type: Boolean,
    default: true,
  },
  order: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

const Look = mongoose.model('Look', lookSchema);

export default Look;