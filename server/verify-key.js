// Simple API key verification
require('dotenv').config();

console.log('🔍 Verifying API Key Setup...');
console.log('');

// Check if .env is loaded
console.log('📁 Environment variables loaded:');
console.log('   NODE_ENV:', process.env.NODE_ENV || 'not set');
console.log('   GEMINI_API_KEY:', process.env.GEMINI_API_KEY ? 'Found ✅' : 'Not found ❌');

if (process.env.GEMINI_API_KEY) {
  const key = process.env.GEMINI_API_KEY;
  console.log('');
  console.log('🔑 API Key Analysis:');
  console.log('   Length:', key.length, '(should be 39 characters)');
  console.log('   Starts with:', key.substring(0, 8) + '...');
  console.log('   Ends with:', '...' + key.substring(key.length - 4));
  console.log('   Contains spaces:', key.includes(' ') ? 'Yes ❌' : 'No ✅');
  console.log('   Contains newlines:', key.includes('\n') ? 'Yes ❌' : 'No ✅');
  
  // Check format
  const isValidFormat = key.startsWith('AIza') && key.length === 39;
  console.log('   Valid format:', isValidFormat ? 'Yes ✅' : 'No ❌');
  
  if (!isValidFormat) {
    console.log('');
    console.log('⚠️  API Key format issues detected!');
    console.log('   Expected: AIzaSy... (39 characters total)');
    console.log('   Actual:', key);
  }
} else {
  console.log('');
  console.log('❌ GEMINI_API_KEY not found in environment variables');
  console.log('');
  console.log('💡 Make sure your .env file contains:');
  console.log('   GEMINI_API_KEY=your-actual-api-key-here');
}

console.log('');
console.log('📋 Next steps if key is invalid:');
console.log('1. Generate a new API key at: https://aistudio.google.com/app/apikey');
console.log('2. Enable Generative Language API in Google Cloud Console');
console.log('3. Make sure there are no billing issues');
console.log('4. Check if your region supports Gemini API');
