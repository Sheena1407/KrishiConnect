const Resource = require('../models/Resource');

// @desc    Get all agricultural resources/products
// @route   GET /api/resources
// @access  Public
const getResources = async (req, res) => {
  try {
    const { category, search, sortBy } = req.query;
    const filter = { isActive: true };

    if (category && category !== 'All') {
      filter.category = category;
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { seller: { $regex: search, $options: 'i' } },
      ];
    }

    let sort = { createdAt: -1 };
    if (sortBy === 'price_asc') sort = { price: 1 };
    else if (sortBy === 'price_desc') sort = { price: -1 };
    else if (sortBy === 'rating') sort = { rating: -1 };

    const resources = await Resource.find(filter).sort(sort);
    res.json({ success: true, count: resources.length, resources });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single resource
// @route   GET /api/resources/:id
// @access  Public
const getResourceById = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, resource });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new resource (Admin only)
// @route   POST /api/resources
// @access  Private/Admin
const createResource = async (req, res) => {
  try {
    const { name, category, description, price, unit, stock, image, seller } = req.body;
    if (!name || !category || !price || !description) {
      return res.status(400).json({
        success: false,
        message: 'Name, category, price and description are required',
      });
    }

    const resource = await Resource.create({
      name,
      category,
      description,
      price: parseFloat(price),
      unit: unit || 'unit',
      stock: parseInt(stock, 10) || 50,
      image: image || 'https://images.unsplash.com/photo-1592417817098-8f3d6910985c?auto=format&fit=crop&q=80&w=400',
      seller: seller || 'Krishi Agro Kendra',
    });

    res.status(201).json({ success: true, message: 'Product added to Krishi Market!', resource });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update resource (Admin only)
// @route   PUT /api/resources/:id
// @access  Private/Admin
const updateResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const { name, category, description, price, unit, stock, image, seller, rating, isActive } = req.body;
    if (name) resource.name = name;
    if (category) resource.category = category;
    if (description) resource.description = description;
    if (price !== undefined) resource.price = parseFloat(price);
    if (unit) resource.unit = unit;
    if (stock !== undefined) resource.stock = parseInt(stock, 10);
    if (image) resource.image = image;
    if (seller) resource.seller = seller;
    if (rating !== undefined) resource.rating = parseFloat(rating);
    if (isActive !== undefined) resource.isActive = isActive;

    const updated = await resource.save();
    res.json({ success: true, message: 'Product updated successfully', resource: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete resource (Admin only)
// @route   DELETE /api/resources/:id
// @access  Private/Admin
const deleteResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    await resource.deleteOne();
    res.json({ success: true, message: 'Product deleted from store' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getResources,
  getResourceById,
  createResource,
  updateResource,
  deleteResource,
};
