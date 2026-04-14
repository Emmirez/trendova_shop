import User from '../models/User.js';

// @GET /api/users/wishlist
export const getWishlist = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('wishlist', 'name price originalPrice image hoverImage images category badge stock sizes colors');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({ wishlist: user.wishlist || [] });
  } catch (error) {
    next(error);
  }
};

// @POST /api/users/wishlist/:productId
export const addToWishlist = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    if (!user.wishlist.includes(productId)) {
      user.wishlist.push(productId);
      await user.save();
    }
    
    // Populate the wishlist items with image fields
    await user.populate('wishlist', 'name price originalPrice image hoverImage images category badge stock sizes colors');
    
    res.json({ 
      message: 'Added to wishlist', 
      wishlist: user.wishlist 
    });
  } catch (error) {
    next(error);
  }
};

// @DELETE /api/users/wishlist/:productId
export const removeFromWishlist = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    user.wishlist = user.wishlist.filter(id => id.toString() !== productId);
    await user.save();
    
    // Populate the wishlist items with image fields
    await user.populate('wishlist', 'name price originalPrice image hoverImage images category badge stock sizes colors');
    
    res.json({ 
      message: 'Removed from wishlist', 
      wishlist: user.wishlist 
    });
  } catch (error) {
    next(error);
  }
};