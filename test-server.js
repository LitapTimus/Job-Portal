// Quick server test
const express = require('express');
const app = express();

app.get('/test', (req, res) => {
  res.json({ message: 'Server is working!' });
});

app.get('/gemini-test', (req, res) => {
  const hasKey = !!(process.env.GEMINI_API_KEY);
  res.json({ 
    geminiKeyConfigured: hasKey,
    keyPreview: hasKey ? process.env.GEMINI_API_KEY.substring(0, 10) + '...' : 'Not set'
  });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Test server running on http://localhost:${PORT}`);
  console.log(`Try: http://localhost:${PORT}/test`);
  console.log(`Try: http://localhost:${PORT}/gemini-test`);
});
