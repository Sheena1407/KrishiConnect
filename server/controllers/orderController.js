const Order = require('../models/Order');
const Resource = require('../models/Resource');
const Notification = require('../models/Notification');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Your cart is empty' });
    }

    if (!shippingAddress || !shippingAddress.recipientName || !shippingAddress.street || !shippingAddress.state) {
      return res.status(400).json({ success: false, message: 'Complete delivery address is required' });
    }

    // Verify stock & calculate total
    let total = 0;
    const validatedItems = [];

    for (const item of items) {
      const product = await Resource.findById(item.resourceId || item._id);
      if (!product) {
        return res.status(404).json({ success: false, message: `Product ${item.name} not found` });
      }

      const qty = parseInt(item.quantity, 10) || 1;
      total += product.price * qty;

      // Adjust stock
      product.stock = Math.max(0, product.stock - qty);
      await product.save();

      validatedItems.push({
        resourceId: product._id,
        name: product.name,
        price: product.price,
        quantity: qty,
        image: product.image,
        unit: product.unit,
      });
    }

    const order = await Order.create({
      userId: req.user._id,
      items: validatedItems,
      totalAmount: total,
      status: 'Confirmed',
      shippingAddress,
      paymentMethod: paymentMethod || 'Cash on Delivery / Kisan Credit Card',
    });

    // Create confirmation notification
    await Notification.create({
      userId: req.user._id,
      title: 'Order Confirmed!',
      message: `Your Krishi Market order #${order._id.toString().slice(-6).toUpperCase()} of ₹${total.toLocaleString('en-IN')} has been placed successfully.`,
      type: 'order',
      link: '/orders',
    });

    res.status(201).json({
      success: true,
      message: 'Order placed successfully! Delivery is scheduled.',
      order,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get logged in user's orders
// @route   GET /api/orders/my
// @access  Private
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, count: orders.length, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('userId', 'name email phone');
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Ensure farmer can only view their own order, unless admin
    if (order.userId._id.toString() !== req.user._id.toString() && req.user.role !== 'Admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to view this order' });
    }

    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all orders (Admin only)
// @route   GET /api/orders
// @access  Private/Admin
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('userId', 'name email phone location')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: orders.length, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update order status (Admin only)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    order.status = status;
    const updated = await order.save();

    // Notify user of status update
    await Notification.create({
      userId: order.userId,
      title: `Order Update: ${status}`,
      message: `Your order #${order._id.toString().slice(-6).toUpperCase()} status is now ${status}.`,
      type: 'order',
      link: '/orders',
    });

    res.json({ success: true, message: `Order status updated to ${status}`, order: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
};
