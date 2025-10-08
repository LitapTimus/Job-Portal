const express = require('express');
const auth = require('../middlewares/auth');

const router = express.Router();

// @route   GET /api/config/ai-status
// @desc    Check AI configuration status
// @access  Private
router.get('/ai-status', auth, (req, res) => {
  const hasGeminiKey = !!(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your-api-key-here');
  
  res.json({
    aiEnabled: hasGeminiKey,
    provider: hasGeminiKey ? 'Gemini AI' : 'Rule-based',
    keyConfigured: hasGeminiKey,
    message: hasGeminiKey 
      ? 'Gemini AI is configured and ready to use' 
      : 'No Gemini API key found - using rule-based analysis'
  });
});

module.exports = router;
