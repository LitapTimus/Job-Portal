const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const auth = require('../middlewares/auth');

const router = express.Router();

// @route   GET /api/gemini-test/models
// @desc    List available Gemini models
// @access  Private (admin only for testing)
router.get('/models', auth, async (req, res) => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return res.status(400).json({ 
        error: 'GEMINI_API_KEY not configured',
        message: 'Please add your Gemini API key to the .env file'
      });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    // Test different model names
    const modelsToTest = [
      'gemini-pro',
      'gemini-1.5-pro',
      'gemini-1.5-flash',
      'gemini-1.5-flash-latest',
      'gemini-1.0-pro'
    ];

    const results = [];

    for (const modelName of modelsToTest) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const testPrompt = "Say 'Hello' in JSON format: {\"message\": \"Hello\"}";
        
        const result = await model.generateContent(testPrompt);
        const response = await result.response;
        const text = response.text();
        
        results.push({
          model: modelName,
          status: 'available',
          testResponse: text.substring(0, 100) + (text.length > 100 ? '...' : '')
        });
      } catch (error) {
        results.push({
          model: modelName,
          status: 'unavailable',
          error: error.message
        });
      }
    }

    res.json({
      apiKeyConfigured: true,
      models: results,
      recommendation: results.find(r => r.status === 'available')?.model || 'No models available'
    });

  } catch (error) {
    console.error('Gemini test error:', error);
    res.status(500).json({ 
      error: 'Failed to test Gemini models',
      message: error.message 
    });
  }
});

// @route   POST /api/gemini-test/analyze
// @desc    Test resume analysis with Gemini
// @access  Private
router.post('/analyze', auth, async (req, res) => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return res.status(400).json({ 
        error: 'GEMINI_API_KEY not configured' 
      });
    }

    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'Text is required for testing' });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const prompt = `
      Analyze this resume text and provide feedback in JSON format:
      
      Text: ${text.substring(0, 500)}...
      
      Return only a JSON object with:
      {
        "strengths": ["strength1", "strength2"],
        "weaknesses": ["weakness1", "weakness2"], 
        "recommendations": ["rec1", "rec2"]
      }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const aiResponse = response.text();
    
    // Try to parse JSON from response
    const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
    let parsedResponse = null;
    
    if (jsonMatch) {
      try {
        parsedResponse = JSON.parse(jsonMatch[0]);
      } catch (parseError) {
        parsedResponse = { error: 'Failed to parse JSON', rawResponse: aiResponse };
      }
    }

    res.json({
      success: true,
      model: 'gemini-pro',
      rawResponse: aiResponse,
      parsedResponse,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Gemini analysis test error:', error);
    res.status(500).json({ 
      error: 'Failed to test analysis',
      message: error.message 
    });
  }
});

module.exports = router;
