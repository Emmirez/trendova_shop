import Look from '../models/Look.js';

// @GET /api/looks
export const getLooks = async (req, res, next) => {
  try {
    const looks = await Look.find({ isActive: true })
      .populate('products')
      .sort({ order: 1 });
    res.json({ looks });
  } catch (error) {
    next(error);
  }
};

// @GET /api/looks/admin
export const getAllLooksForAdmin = async (req, res, next) => {
  try {
    const looks = await Look.find()
      .populate('products')
      .sort({ order: 1 });
    res.json({ looks });
  } catch (error) {
    next(error);
  }
};

// @PUT /api/looks/:id
export const updateLook = async (req, res, next) => {
  try {
    const { title, description, products, order } = req.body;
    const look = await Look.findByIdAndUpdate(
      req.params.id,
      { title, description, products, order },
      { new: true, runValidators: true }
    ).populate('products');
    
    if (!look) {
      return res.status(404).json({ message: 'Look not found' });
    }
    
    res.json({ message: 'Look updated successfully', look });
  } catch (error) {
    next(error);
  }
};

// @POST /api/looks/initialize
export const initializeLooks = async (req, res, next) => {
  try {
    // Check if looks already exist
    const existingLooks = await Look.find();
    if (existingLooks.length > 0) {
      return res.status(400).json({ message: 'Looks already initialized' });
    }
    
    // Create default looks
    const defaultLooks = [
      {
        title: 'The Night Out',
        description: 'Head to toe luxury for when the occasion demands it.',
        products: [],
        order: 0,
      },
      {
        title: 'The Street Edit',
        description: 'Casual luxury. Effortless from morning to night.',
        products: [],
        order: 1,
      },
    ];
    
    const looks = await Look.insertMany(defaultLooks);
    res.status(201).json({ message: 'Looks initialized', looks });
  } catch (error) {
    next(error);
  }
};

// @POST /api/looks
export const createLook = async (req, res, next) => {
  try {
    const { title, description, products, order } = req.body;
    
    const look = await Look.create({
      title,
      description,
      products: products || [],
      order: order || 0,
      isActive: true,
    });
    
    res.status(201).json({ message: 'Look created successfully', look });
  } catch (error) {
    next(error);
  }
};