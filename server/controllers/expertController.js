const Expert = require('../models/Expert');
const Consultation = require('../models/Consultation');
const Notification = require('../models/Notification');

// @desc    Get all agricultural experts
// @route   GET /api/experts
// @access  Public
const getExperts = async (req, res) => {
  try {
    const { specialization } = req.query;
    const filter = { isActive: true };
    if (specialization && specialization !== 'All') {
      filter.specialization = specialization;
    }
    const experts = await Expert.find(filter).sort({ rating: -1 });
    res.json({ success: true, count: experts.length, experts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new expert (Admin only)
// @route   POST /api/experts
// @access  Private/Admin
const createExpert = async (req, res) => {
  try {
    const { name, specialization, experience, qualification, rating, consultationFee, availability, image } = req.body;
    if (!name || !specialization || !experience) {
      return res.status(400).json({ success: false, message: 'Name, specialization and experience are required' });
    }

    const expert = await Expert.create({
      name,
      specialization,
      experience,
      qualification: qualification || 'Agricultural Specialist',
      rating: parseFloat(rating) || 4.8,
      consultationFee: parseFloat(consultationFee) || 0,
      availability: availability || 'Mon - Sat (10 AM - 5 PM)',
      image: image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
    });

    res.status(201).json({ success: true, message: 'Expert added successfully!', expert });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update expert (Admin only)
// @route   PUT /api/experts/:id
// @access  Private/Admin
const updateExpert = async (req, res) => {
  try {
    const expert = await Expert.findById(req.params.id);
    if (!expert) {
      return res.status(404).json({ success: false, message: 'Expert not found' });
    }

    Object.assign(expert, req.body);
    const updated = await expert.save();
    res.json({ success: true, message: 'Expert details updated', expert: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete expert (Admin only)
// @route   DELETE /api/experts/:id
// @access  Private/Admin
const deleteExpert = async (req, res) => {
  try {
    const expert = await Expert.findById(req.params.id);
    if (!expert) {
      return res.status(404).json({ success: false, message: 'Expert not found' });
    }
    await expert.deleteOne();
    res.json({ success: true, message: 'Expert removed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Book expert consultation
// @route   POST /api/experts/consultations
// @access  Private
const bookConsultation = async (req, res) => {
  try {
    const { expertId, topic, question, date, time } = req.body;
    if (!expertId || !topic || !question || !date || !time) {
      return res.status(400).json({ success: false, message: 'Please provide expert, topic, question, date and time' });
    }

    const expert = await Expert.findById(expertId);
    if (!expert) {
      return res.status(404).json({ success: false, message: 'Expert not found' });
    }

    const consultation = await Consultation.create({
      userId: req.user._id,
      expertId,
      topic,
      question,
      date,
      time,
      status: 'Confirmed',
    });

    await Notification.create({
      userId: req.user._id,
      title: 'Consultation Scheduled!',
      message: `Your appointment with ${expert.name} (${expert.specialization}) is confirmed for ${date} at ${time}.`,
      type: 'consultation',
      link: '/experts',
    });

    const populated = await Consultation.findById(consultation._id).populate('expertId', 'name specialization image rating');

    res.status(201).json({
      success: true,
      message: `Consultation confirmed with ${expert.name}!`,
      consultation: populated,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user's consultations
// @route   GET /api/experts/consultations/my
// @access  Private
const getMyConsultations = async (req, res) => {
  try {
    const consultations = await Consultation.find({ userId: req.user._id })
      .populate('expertId', 'name specialization image experience consultationFee availability')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: consultations.length, consultations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all consultations (Admin only)
// @route   GET /api/experts/consultations/all
// @access  Private/Admin
const getAllConsultations = async (req, res) => {
  try {
    const consultations = await Consultation.find()
      .populate('userId', 'name email phone location')
      .populate('expertId', 'name specialization')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: consultations.length, consultations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update consultation status / reply
// @route   PUT /api/experts/consultations/:id
// @access  Private
const updateConsultation = async (req, res) => {
  try {
    const consultation = await Consultation.findById(req.params.id);
    if (!consultation) {
      return res.status(404).json({ success: false, message: 'Consultation not found' });
    }

    const { status, expertReply } = req.body;
    if (status) consultation.status = status;
    if (expertReply !== undefined) consultation.expertReply = expertReply;

    const updated = await consultation.save();
    res.json({ success: true, message: 'Consultation updated', consultation: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getExperts,
  createExpert,
  updateExpert,
  deleteExpert,
  bookConsultation,
  getMyConsultations,
  getAllConsultations,
  updateConsultation,
};
