import Product from '../models/Product.js';

// @GET /api/products — public
export const getAllProducts = async (req, res, next) => {
  try {
    const { category, badge, search, page = 1, limit = 50 } = req.query;

    const query = { isActive: true };
    if (category) query.category = category;
    if (badge) query.badge = badge;
    if (search) query.name = { $regex: search, $options: 'i' };

    const products = await Product.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Product.countDocuments(query);

    res.json({ products, total });
  } catch (error) {
    next(error);
  }
};

// @GET /api/products/:id — public
export const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product || !product.isActive) {
      return res.status(404).json({ message: 'Product not found.' });
    }
    res.json({ product });
  } catch (error) {
    next(error);
  }
};

// @POST /api/products — admin/superadmin
export const createProduct = async (req, res, next) => {
  try {
    const product = await Product.create({
      ...req.body,
      createdBy: req.user._id,
    });
    res.status(201).json({ message: 'Product created.', product });
  } catch (error) {
    next(error);
  }
};

// @PUT /api/products/:id — admin/superadmin
export const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!product) return res.status(404).json({ message: 'Product not found.' });
    res.json({ message: 'Product updated.', product });
  } catch (error) {
    next(error);
  }
};

// @DELETE /api/products/:id — admin/superadmin
export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found.' });

    product.isActive = false;
    await product.save();

    res.json({ message: 'Product removed.' });
  } catch (error) {
    next(error);
  }
};