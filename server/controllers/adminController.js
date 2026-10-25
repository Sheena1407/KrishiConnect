const User = require('../models/User');
const Farm = require('../models/Farm');
const Crop = require('../models/Crop');
const SoilReport = require('../models/SoilReport');
const CommunityPost = require('../models/CommunityPost');

// @desc    Get all users with search and filter
// @route   GET /api/admin/users
// @access  Private/Admin
const getUsers = async (req, res) => {
  try {
    const { search, role } = req.query;
    const filter = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
      ];
    }

    if (role && role !== 'All') {
      filter.role = role;
    }

    const users = await User.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, count: users.length, users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Toggle user active status
// @route   PATCH /api/admin/users/:id/toggle-status
// @access  Private/Admin
const toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.json({
      success: true,
      message: `User account has been ${user.isActive ? 'activated' : 'deactivated'}`,
      user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.role === 'Admin') {
      return res.status(400).json({ success: false, message: 'Admin accounts cannot be deleted directly' });
    }

    await Farm.deleteMany({ userId: user._id });
    await Crop.deleteMany({ userId: user._id });
    await SoilReport.deleteMany({ userId: user._id });
    await user.deleteOne();

    res.json({ success: true, message: 'User and all associated data deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all farms for admin overview
// @route   GET /api/admin/farms
// @access  Private/Admin
const getAllFarms = async (req, res) => {
  try {
    const farms = await Farm.find().populate('userId', 'name email location').sort({ createdAt: -1 });
    res.json({ success: true, count: farms.length, farms });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all crops for admin overview
// @route   GET /api/admin/crops
// @access  Private/Admin
const getAllCrops = async (req, res) => {
  try {
    const crops = await Crop.find()
      .populate('userId', 'name email')
      .populate('farmId', 'farmName location area')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: crops.length, crops });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all soil reports for admin
// @route   GET /api/admin/soil-reports
// @access  Private/Admin
const getAllSoilReports = async (req, res) => {
  try {
    const reports = await SoilReport.find()
      .populate('userId', 'name email location')
      .populate('farmId', 'farmName location area')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: reports.length, reports });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Moderate / delete inappropriate community comment or post
// @route   DELETE /api/admin/community/:postId/comments/:commentId
// @access  Private/Admin
const deleteComment = async (req, res) => {
  try {
    const post = await CommunityPost.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    post.comments = post.comments.filter((c) => c._id.toString() !== req.params.commentId);
    await post.save();

    res.json({ success: true, message: 'Comment moderated and removed', comments: post.comments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getUsers,
  toggleUserStatus,
  deleteUser,
  getAllFarms,
  getAllCrops,
  getAllSoilReports,
  deleteComment,
};
