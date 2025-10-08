// Advanced Gemini API test with multiple approaches
require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testGeminiAdvanced() {
  console.log('🔍 Advanced Gemini API Testing...');
  console.log('');
  
  if (!process.env.GEMINI_API_KEY) {
    console.log('❌ GEMINI_API_KEY not found');
    return;
  }
  
  const apiKey = process.env.GEMINI_API_KEY;
  console.log('✅ API Key:', apiKey.substring(0, 10) + '...' + apiKey.substring(apiKey.length - 4));
  
  // Try different initialization methods
  const testConfigs = [
    {
      name: 'Standard Config',
      config: { apiKey }
    },
    {
      name: 'With Base URL',
      config: { 
        apiKey,
        baseUrl: 'https://generativelanguage.googleapis.com'
      }
    }
  ];
  
  for (const testConfig of testConfigs) {
    console.log(`\n🧪 Testing: ${testConfig.name}`);
    
    try {
      const genAI = new GoogleGenerativeAI(testConfig.config.apiKey);
      
      // Try the most basic model first
      const modelsToTest = [
        'gemini-pro',
        'gemini-1.5-flash',
        'gemini-1.5-pro'
      ];
      
      for (const modelName of modelsToTest) {
        try {
          console.log(`   🔍 Testing model: ${modelName}`);
          const model = genAI.getGenerativeModel({ model: modelName });
          
          // Very simple prompt
          const result = await model.generateContent('Hi');
          const response = await result.response;
          const text = response.text();
          
          console.log(`   ✅ SUCCESS with ${modelName}!`);
          console.log(`   📝 Response: "${text.trim()}"`);
          
          return { success: true, model: modelName, response: text };
          
        } catch (modelError) {
          console.log(`   ❌ ${modelName} failed: ${modelError.message.substring(0, 100)}...`);
        }
      }
      
    } catch (configError) {
      console.log(`   ❌ Config failed: ${configError.message}`);
    }
  }
  
  console.log('\n❌ All tests failed');
  return { success: false };
}

// Also test with a direct HTTP request to bypass SDK issues
async function testDirectAPI() {
  console.log('\n🌐 Testing Direct API Call...');
  
  const apiKey = process.env.GEMINI_API_KEY;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;
  
  const payload = {
    contents: [{
      parts: [{
        text: "Hello"
      }]
    }]
  };
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });
    
    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Direct API call successful!');
      console.log('📝 Response:', JSON.stringify(data, null, 2));
      return true;
    } else {
      console.log('❌ Direct API call failed:');
      console.log('   Status:', response.status);
      console.log('   Error:', JSON.stringify(data, null, 2));
      return false;
    }
    
  } catch (error) {
    console.log('❌ Direct API call error:', error.message);
    return false;
  }
}

// Run both tests
async function runAllTests() {
  const sdkResult = await testGeminiAdvanced();
  const directResult = await testDirectAPI();
  
  console.log('\n📊 Test Summary:');
  console.log('   SDK Test:', sdkResult.success ? '✅ Success' : '❌ Failed');
  console.log('   Direct API Test:', directResult ? '✅ Success' : '❌ Failed');
  
  if (!sdkResult.success && !directResult) {
    console.log('\n💡 Possible solutions:');
    console.log('1. Wait 5-10 minutes for API enablement to propagate');
    console.log('2. Generate a completely new API key');
    console.log('3. Create a new Google Cloud project');
    console.log('4. Check if your region/country supports Gemini API');
    console.log('5. Verify billing is enabled (even for free tier)');
  }
}

runAllTests().catch(console.error);
