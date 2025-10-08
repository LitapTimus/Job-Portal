const { GoogleGenerativeAI } = require('@google/generative-ai');

// Get the first available Gemini model
async function getAvailableModel() {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY not configured');
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  
  // List of models to try in order of preference (for older SDK)
  const modelsToTry = [
    'gemini-pro',
    'gemini-1.5-flash-latest',
    'gemini-1.5-pro-latest',
    'gemini-1.0-pro-latest'
  ];

  for (const modelName of modelsToTry) {
    try {
      console.log(`🔍 Testing model: ${modelName}`);
      const model = genAI.getGenerativeModel({ model: modelName });
      
      // Test with a simple prompt
      const result = await model.generateContent('Test');
      const response = await result.response;
      
      if (response && response.text) {
        console.log(`✅ Model ${modelName} is working!`);
        return { model, modelName };
      }
    } catch (error) {
      console.log(`❌ Model ${modelName} failed: ${error.message}`);
      continue;
    }
  }
  
  throw new Error('No working Gemini models found. Please check your API key and region availability.');
}

// Cache the working model to avoid repeated testing
let cachedModel = null;
let cachedModelName = null;

async function getCachedModel() {
  if (!cachedModel) {
    const result = await getAvailableModel();
    cachedModel = result.model;
    cachedModelName = result.modelName;
  }
  return { model: cachedModel, modelName: cachedModelName };
}

module.exports = {
  getAvailableModel,
  getCachedModel
};
