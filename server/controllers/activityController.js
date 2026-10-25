const FarmActivity = require('../models/FarmActivity');
const Farm = require('../models/Farm');

// @desc    Get all farm activities for user
// @route   GET /api/activities
// @access  Private
const getActivities = async (req, res) => {
  try {
    const activities = await FarmActivity.find({ userId: req.user._id })
      .populate('farmId', 'farmName location')
      .populate('cropId', 'cropName variety')
      .sort({ date: 1, time: 1 });

    res.json({ success: true, count: activities.length, activities });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new farm activity
// @route   POST /api/activities
// @access  Private
const createActivity = async (req, res) => {
  try {
    const { farmId, cropId, title, description, activityType, date, time } = req.body;
    if (!farmId || !title || !date) {
      return res.status(400).json({ success: false, message: 'Farm, title and date are required' });
    }

    const farm = await Farm.findOne({ _id: farmId, userId: req.user._id });
    if (!farm) {
      return res.status(404).json({ success: false, message: 'Farm not found' });
    }

    const activity = await FarmActivity.create({
      userId: req.user._id,
      farmId,
      cropId: cropId || null,
      title,
      description: description || '',
      activityType: activityType || 'General',
      date,
      time: time || '08:00 AM',
      status: 'Upcoming',
    });

    const populated = await FarmActivity.findById(activity._id)
      .populate('farmId', 'farmName location')
      .populate('cropId', 'cropName variety');

    res.status(201).json({
      success: true,
      message: 'Farm activity scheduled!',
      activity: populated,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update activity
// @route   PUT /api/activities/:id
// @access  Private
const updateActivity = async (req, res) => {
  try {
    const activity = await FarmActivity.findOne({ _id: req.params.id, userId: req.user._id });
    if (!activity) {
      return res.status(404).json({ success: false, message: 'Activity not found' });
    }

    Object.assign(activity, req.body);
    const updated = await activity.save();

    const populated = await FarmActivity.findById(updated._id)
      .populate('farmId', 'farmName location')
      .populate('cropId', 'cropName variety');

    res.json({ success: true, message: 'Activity updated', activity: populated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Toggle activity status
// @route   PATCH /api/activities/:id/toggle
// @access  Private
const toggleStatus = async (req, res) => {
  try {
    const activity = await FarmActivity.findOne({ _id: req.params.id, userId: req.user._id });
    if (!activity) {
      return res.status(404).json({ success: false, message: 'Activity not found' });
    }

    activity.status = activity.status === 'Completed' ? 'Upcoming' : 'Completed';
    await activity.save();

    res.json({ success: true, message: `Activity marked as ${activity.status}`, activity });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete activity
// @route   DELETE /api/activities/:id
// @access  Private
const deleteActivity = async (req, res) => {
  try {
    const activity = await FarmActivity.findOne({ _id: req.params.id, userId: req.user._id });
    if (!activity) {
      return res.status(404).json({ success: false, message: 'Activity not found' });
    }

    await activity.deleteOne();
    res.json({ success: true, message: 'Activity removed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getActivities,
  createActivity,
  updateActivity,
  toggleStatus,
  deleteActivity,
};
