import mongoose from 'mongoose';

const instagramFeedSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  likes: {
    type: String,
    default: '0',
  },
  caption: {
    type: String,
    required: true,
  },
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

const InstagramFeed = mongoose.model('InstagramFeed', instagramFeedSchema);

export default InstagramFeed;