const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const auth = require('../middlewares/auth');

const router = express.Router();

// @route   GET /api/debug/health
// @desc    Simple health check
// @access  Public
router.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Debug routes are working',
    timestamp: new Date().toISOString(),
    geminiKeyConfigured: !!(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your-api-key-here')
  });
});

// @route   GET /api/debug/gemini-models
// @desc    Check available Gemini models for your API key
// @access  Public (for testing)
router.get('/gemini-models', async (req, res) => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return res.status(400).json({ 
        error: 'GEMINI_API_KEY not configured',
        message: 'Add GEMINI_API_KEY=your-key-here to your .env file'
      });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    // Test common model names
    const modelsToTest = [
      'gemini-1.5-flash',
      'gemini-1.5-pro',
      'gemini-1.0-pro',
      'gemini-pro',
      'models/gemini-1.5-flash',
      'models/gemini-1.5-pro', 
      'models/gemini-1.0-pro',
      'models/gemini-pro'
    ];

    const results = [];
    let workingModel = null;

    for (const modelName of modelsToTest) {
      try {
        console.log(`Testing ${modelName}...`);
        const model = genAI.getGenerativeModel({ model: modelName });
        
        // Simple test
        const result = await model.generateContent('Hello');
        const response = await result.response;
        const text = response.text();
        
        results.push({
          model: modelName,
          status: '✅ Available',
          testResponse: text.substring(0, 50)
        });
        
        if (!workingModel) {
          workingModel = modelName;
        }
        
      } catch (error) {
        results.push({
          model: modelName,
          status: '❌ Not Available',
          error: error.message.substring(0, 100)
        });
      }
    }

    res.json({
      apiKeyConfigured: true,
      workingModel,
      totalTested: modelsToTest.length,
      availableModels: results.filter(r => r.status.includes('✅')).length,
      results,
      recommendation: workingModel ? 
        `Use model: ${workingModel}` : 
        'No working models found - check your API key and region'
    });

  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to test models',
      message: error.message 
    });
  }
});

// @route   POST /api/debug/test-analysis
// @desc    Test resume analysis with working model
// @access  Public (for testing)
router.post('/test-analysis', async (req, res) => {
  try {
    const { getCachedModel } = require('../utils/geminiModels');
    
    const sampleText = req.body.text || `
      John Doe
      Software Engineer
      5 years experience in React, Node.js, MongoDB
      Bachelor's degree in Computer Science
      Email: john@example.com
      Phone: (555) 123-4567
    `;

    const { model, modelName } = await getCachedModel();
    
    const prompt = `Analyze this resume briefly and return JSON:
    
    ${sampleText}
    
    Return only: {"score": 75, "strengths": ["Good technical skills"], "suggestions": ["Add more details"]}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({
      success: true,
      modelUsed: modelName,
      rawResponse: text,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    res.status(500).json({ 
      error: 'Test failed',
      message: error.message 
    });
  }
});

module.exports = router;
