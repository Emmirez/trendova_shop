import InstagramFeed from '../models/InstagramFeed.js';
import Product from '../models/Product.js';

// @GET /api/instagram
export const getInstagramFeed = async (req, res, next) => {
  try {
    const feed = await InstagramFeed.find({ isActive: true })
      .populate('product', 'name image category price')
      .sort({ order: 1, createdAt: -1 })
      .limit(12);
    res.json({ feed });
  } catch (error) {
    next(error);
  }
};

// @GET /api/instagram/admin
export const getInstagramFeedForAdmin = async (req, res, next) => {
  try {
    const feed = await InstagramFeed.find()
      .populate('product', 'name image category price')
      .sort({ order: 1, createdAt: -1 });
    res.json({ feed });
  } catch (error) {
    next(error);
  }
};

// @POST /api/instagram
export const addToInstagramFeed = async (req, res, next) => {
  try {
    const { productId, likes, caption, order } = req.body;
    
    // Check if product already exists in feed
    const existing = await InstagramFeed.findOne({ product: productId });
    if (existing) {
      return res.status(400).json({ message: 'Product already in Instagram feed' });
    }
    
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    const feedItem = await InstagramFeed.create({
      product: productId,
      likes: likes || '0',
      caption: caption || product.name,
      order: order || 0,
    });
    
    await feedItem.populate('product', 'name image category price');
    
    res.status(201).json({ message: 'Added to Instagram feed', feedItem });
  } catch (error) {
    next(error);
  }
};

// @PUT /api/instagram/:id
export const updateInstagramFeedItem = async (req, res, next) => {
  try {
    const { likes, caption, order, isActive } = req.body;
    const feedItem = await InstagramFeed.findByIdAndUpdate(
      req.params.id,
      { likes, caption, order, isActive },
      { new: true }
    ).populate('product', 'name image category price');
    
    if (!feedItem) {
      return res.status(404).json({ message: 'Feed item not found' });
    }
    
    res.json({ message: 'Updated successfully', feedItem });
  } catch (error) {
    next(error);
  }
};

// @DELETE /api/instagram/:id
export const removeFromInstagramFeed = async (req, res, next) => {
  try {
    const feedItem = await InstagramFeed.findByIdAndDelete(req.params.id);
    if (!feedItem) {
      return res.status(404).json({ message: 'Feed item not found' });
    }
    res.json({ message: 'Removed from Instagram feed' });
  } catch (error) {
    next(error);
  }
};