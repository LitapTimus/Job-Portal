// Simple Gemini API test
require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testGemini() {
  console.log('🔍 Testing Gemini API...');
  
  if (!process.env.GEMINI_API_KEY) {
    console.log('❌ GEMINI_API_KEY not found in .env file');
    return;
  }
  
  console.log('✅ API Key found:', process.env.GEMINI_API_KEY.substring(0, 10) + '...');
  
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  
  // Test with the most basic model name
  const modelsToTest = [
    'gemini-pro',
    'gemini-1.5-flash-latest',
    'gemini-1.5-pro-latest'
  ];
  
  for (const modelName of modelsToTest) {
    try {
      console.log(`\n🔍 Testing model: ${modelName}`);
      const model = genAI.getGenerativeModel({ model: modelName });
      
      const prompt = "Say hello in one word";
      console.log('📤 Sending prompt...');
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      console.log(`✅ SUCCESS with ${modelName}!`);
      console.log(`📝 Response: ${text}`);
      
      // If we get here, this model works
      return modelName;
      
    } catch (error) {
      console.log(`❌ ${modelName} failed:`);
      console.log(`   Error: ${error.message}`);
    }
  }
  
  console.log('\n❌ No working models found');
  return null;
}

// Run the test
testGemini()
  .then(workingModel => {
    if (workingModel) {
      console.log(`\n🎉 SUCCESS! Use model: ${workingModel}`);
    } else {
      console.log('\n💡 Try these steps:');
      console.log('1. Check your API key is correct');
      console.log('2. Verify your Google Cloud project has Gemini API enabled');
      console.log('3. Check if your region supports Gemini API');
      console.log('4. Try generating a new API key');
    }
    process.exit(0);
  })
  .catch(error => {
    console.error('💥 Test failed:', error);
    process.exit(1);
  });
