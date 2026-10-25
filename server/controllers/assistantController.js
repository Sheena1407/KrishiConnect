const { answerFarmerQuery } = require('../services/krishiAssistantService');

// @desc    Ask Krishi Assistant
// @route   POST /api/assistant/ask
// @access  Public / Private
const askAssistant = async (req, res) => {
  try {
    const { message } = req.body;
    const answer = answerFarmerQuery(message || '');
    res.json({
      success: true,
      query: message,
      reply: answer.reply,
      suggestions: answer.suggestions,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  askAssistant,
};
