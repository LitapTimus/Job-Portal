# AI Resume Analyzer Setup Guide

## 🚀 Overview

The AI Resume Analyzer is a powerful feature that provides candidates with instant, AI-powered feedback on their resumes. It analyzes various sections, provides scoring, ATS compatibility checks, and personalized improvement suggestions.

## 📋 Features

- **File Upload Support**: PDF, DOCX, and TXT files (up to 5MB)
- **AI-Powered Analysis**: Uses OpenAI GPT for intelligent recommendations
- **Comprehensive Scoring**: Overall score and section-by-section analysis
- **ATS Compatibility**: Checks resume compatibility with Applicant Tracking Systems
- **Personalized Suggestions**: Tailored improvement recommendations
- **Modern UI**: Beautiful, responsive interface with animations
- **Real-time Processing**: Instant analysis with progress indicators

## 🛠 Installation Steps

### Backend Setup

1. **Install Dependencies**
```bash
cd server
npm install pdf-parse mammoth @google/generative-ai natural
```

2. **Environment Variables**
Add to your `.env` file:
```env
# Optional: For AI-powered recommendations (recommended)
GEMINI_API_KEY=your_gemini_api_key_here

# If not provided, the system will use rule-based analysis
```

3. **Create Upload Directory**
The system automatically creates the upload directory, but you can manually create it:
```bash
mkdir -p uploads/resumes
```

### Frontend Setup

1. **Install Dependencies**
```bash
cd client
npm install react-dropzone
```

2. **Files Added**
- `src/components/ResumeUpload.jsx` - Drag & drop upload component
- `src/components/ResumeAnalysis.jsx` - Analysis results display
- `src/pages/ResumeAnalyzer.jsx` - Main analyzer page
- Route added to `App.jsx` for `/resume-analyzer`

## 🔧 Configuration

### Gemini AI Integration (Optional but Recommended)

1. **Get Gemini API Key**
   - Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
   - Create an account and generate an API key
   - Free tier available with generous limits

2. **Add to Environment**
```env
GEMINI_API_KEY=your-actual-gemini-api-key-here
```

3. **Fallback System**
If no Gemini key is provided, the system uses rule-based analysis which still provides:
- Section scoring
- Basic recommendations
- ATS compatibility checks
- Keyword extraction

## 📊 Analysis Components

### 1. Overall Score (0-100)
- Weighted average of all section scores
- Visual progress indicator
- Performance categorization (Excellent/Good/Needs Improvement)

### 2. Section Analysis
- **Contact Information**: Email, phone, LinkedIn presence
- **Professional Summary**: Length, presence, quality indicators
- **Work Experience**: Action verbs, years of experience, formatting
- **Education**: Degree information, institution details
- **Skills**: Technical skills extraction, relevance scoring
- **Formatting**: Structure, consistency, readability

### 3. ATS Compatibility
- Special character detection
- Format compatibility
- Keyword optimization
- Structure analysis

### 4. AI Recommendations (with Gemini)
- Personalized improvement suggestions
- Strength identification
- Weakness analysis
- Industry-specific advice

## 🎨 UI Components

### ResumeUpload Component
```jsx
<ResumeUpload 
  onUploadSuccess={handleSuccess}
  onUploadError={handleError}
/>
```

Features:
- Drag & drop interface
- File type validation
- Size limit enforcement (5MB)
- Upload progress indicator
- Error handling with user-friendly messages

### ResumeAnalysis Component
```jsx
<ResumeAnalysis 
  analysis={analysisData}
  onReAnalyze={handleReAnalyze}
/>
```

Features:
- Tabbed interface (Overview, Sections, Recommendations, ATS)
- Interactive score visualizations
- Detailed section breakdowns
- Actionable improvement suggestions

## 🔐 Security Features

- **File Type Validation**: Only allows PDF, DOCX, TXT
- **Size Limits**: Maximum 5MB per file
- **Authentication Required**: Only logged-in candidates can access
- **File Cleanup**: Automatic file deletion when resume is removed
- **Input Sanitization**: All text content is sanitized

## 📱 User Experience

### Upload Flow
1. Drag & drop or click to select file
2. Real-time validation feedback
3. Upload progress indicator
4. Automatic analysis processing
5. Results display with interactive tabs

### Analysis Flow
1. Overall score with visual indicator
2. Tabbed detailed analysis
3. Section-by-section breakdown
4. Personalized recommendations
5. ATS compatibility report

## 🚀 API Endpoints

```
POST   /api/resume/upload        - Upload and analyze resume
GET    /api/resume/analysis      - Get current resume analysis
GET    /api/resume/all          - Get all user's resumes
DELETE /api/resume/:id          - Delete resume
POST   /api/resume/:id/reanalyze - Re-analyze existing resume
GET    /api/resume/tips         - Get improvement tips
```

## 🧪 Testing

### Test File Types
- Upload various PDF formats
- Test DOCX files with different structures
- Try plain text resumes
- Test file size limits
- Verify error handling for unsupported formats

### Test Analysis
- Upload resumes with different quality levels
- Verify scoring accuracy
- Check recommendation relevance
- Test ATS compatibility detection

## 🔧 Troubleshooting

### Common Issues

1. **File Upload Fails**
   - Check file size (max 5MB)
   - Verify file type (PDF/DOCX/TXT only)
   - Ensure proper authentication

2. **Analysis Not Working**
   - Check server logs for errors
   - Verify text extraction from uploaded file
   - Ensure all dependencies are installed

3. **Gemini AI Integration Issues**
   - Verify API key is correct
   - Check API quota limits
   - System falls back to rule-based analysis if API fails

### Debug Mode
Enable detailed logging by setting:
```env
NODE_ENV=development
```

## 📈 Performance Optimization

- **File Processing**: Asynchronous text extraction
- **Caching**: Analysis results cached in database
- **Lazy Loading**: Components load on demand
- **Progress Indicators**: Real-time feedback during processing

## 🔮 Future Enhancements

- **Multiple Resume Versions**: Compare different resume versions
- **Industry-Specific Analysis**: Tailored recommendations by field
- **Integration with Job Matching**: Resume optimization for specific jobs
- **Batch Processing**: Analyze multiple resumes simultaneously
- **Export Reports**: PDF/Word export of analysis results

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Review server logs for errors
3. Verify all dependencies are installed
4. Ensure proper environment configuration

The AI Resume Analyzer enhances your job portal by providing valuable insights to candidates, helping them improve their resumes and increase their chances of landing interviews.
