const natural = require('natural');
const OpenAI = require('openai');

class ResumeAnalyzer {
  constructor() {
    this.tokenizer = new natural.WordTokenizer();
    this.stemmer = natural.PorterStemmer;
  }

  // Main analysis function
  async analyzeResume(extractedText) {
    try {
      const analysis = {
        overallScore: 0,
        sections: {},
        keywords: [],
        recommendations: [],
        strengths: [],
        weaknesses: [],
        atsCompatibility: {}
      };

      // Analyze different sections
      analysis.sections.contactInfo = this.analyzeContactInfo(extractedText);
      analysis.sections.summary = this.analyzeSummary(extractedText);
      analysis.sections.experience = this.analyzeExperience(extractedText);
      analysis.sections.education = this.analyzeEducation(extractedText);
      analysis.sections.skills = this.analyzeSkills(extractedText);
      analysis.sections.formatting = this.analyzeFormatting(extractedText);

      // Extract keywords
      analysis.keywords = this.extractKeywords(extractedText);

      analysis.overallScore = this.calculateOverallScore(analysis.sections);

      // ATS Compatibility check
      analysis.atsCompatibility = this.checkATSCompatibility(extractedText, analysis.sections);

      // Generate AI recommendations
      let aiRecommendations;
      try {
        if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your-api-key-here') {
          console.log('🤖 Using OpenAI for resume analysis');
          aiRecommendations = await this.generateOpenAIRecommendations(extractedText, analysis);
          analysis.aiPowered = true;
        } else if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your-api-key-here') {
          console.log('🤖 Using Gemini AI for resume analysis');
          aiRecommendations = await this.generateGeminiRecommendations(extractedText, analysis);
          analysis.aiPowered = true;
        } else {
          console.log('📋 Using rule-based analysis (no AI API key found)');
          aiRecommendations = this.generateRuleBasedRecommendations(analysis.sections);
          analysis.aiPowered = false;
        }
      } catch (error) {
        console.error('AI recommendation error:', error);
        aiRecommendations = this.generateRuleBasedRecommendations(analysis.sections);
        analysis.aiPowered = false;
        analysis.strengths = ruleBasedRecommendations.strengths;
        analysis.weaknesses = ruleBasedRecommendations.weaknesses;
        analysis.aiPowered = false; // Flag to indicate rule-based was used
      }

      return analysis;
    } catch (error) {
      console.error('Resume analysis error:', error);
      throw new Error('Failed to analyze resume');
    }
  }

  // Analyze contact information
  analyzeContactInfo(text) {
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
    const phoneRegex = /(\+\d{1,3}[-.\s]?)?\(?\d{1,4}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,9}/;
    const linkedinRegex = /linkedin\.com\/in\/[\w-]+/i;

    const hasEmail = emailRegex.test(text);
    const hasPhone = phoneRegex.test(text);
    const hasLinkedIn = linkedinRegex.test(text);

    let score = 0;
    const suggestions = [];

    if (hasEmail) score += 40;
    else suggestions.push('Add a professional email address');

    if (hasPhone) score += 30;
    else suggestions.push('Include your phone number');

    if (hasLinkedIn) score += 30;
    else suggestions.push('Add your LinkedIn profile URL');

    return {
      score,
      found: hasEmail || hasPhone,
      suggestions
    };
  }

  // Analyze professional summary
  analyzeSummary(text) {
    const summaryKeywords = ['summary', 'objective', 'profile', 'about'];
    const hasSummarySection = summaryKeywords.some(keyword => 
      text.toLowerCase().includes(keyword)
    );

    const words = this.tokenizer.tokenize(text.toLowerCase());
    const summaryLength = words.length;

    let score = 0;
    const suggestions = [];

    if (hasSummarySection) {
      score += 50;
      if (summaryLength >= 50 && summaryLength <= 150) {
        score += 50;
      } else if (summaryLength < 50) {
        suggestions.push('Expand your professional summary (aim for 50-150 words)');
      } else {
        suggestions.push('Shorten your professional summary (aim for 50-150 words)');
      }
    } else {
      suggestions.push('Add a professional summary or objective statement');
    }

    return {
      score,
      found: hasSummarySection,
      suggestions
    };
  }

  // Analyze work experience
  analyzeExperience(text) {
    const experienceKeywords = ['experience', 'employment', 'work history', 'career'];
    const hasExperienceSection = experienceKeywords.some(keyword => 
      text.toLowerCase().includes(keyword)
    );

    // Try to estimate years of experience
    const yearRegex = /\b(19|20)\d{2}\b/g;
    const years = text.match(yearRegex) || [];
    const uniqueYears = [...new Set(years)].sort();
    const yearsOfExperience = uniqueYears.length > 1 ? 
      parseInt(uniqueYears[uniqueYears.length - 1]) - parseInt(uniqueYears[0]) : 0;

    // Check for action verbs
    const actionVerbs = ['managed', 'led', 'developed', 'created', 'implemented', 'achieved', 'improved', 'increased'];
    const hasActionVerbs = actionVerbs.some(verb => 
      text.toLowerCase().includes(verb)
    );

    let score = 0;
    const suggestions = [];

    if (hasExperienceSection) score += 40;
    else suggestions.push('Add a work experience section');

    if (hasActionVerbs) score += 30;
    else suggestions.push('Use strong action verbs to describe your achievements');

    if (yearsOfExperience > 0) score += 30;

    return {
      score,
      found: hasExperienceSection,
      yearsOfExperience,
      suggestions
    };
  }

  // Analyze education
  analyzeEducation(text) {
    const educationKeywords = ['education', 'degree', 'university', 'college', 'bachelor', 'master', 'phd'];
    const hasEducationSection = educationKeywords.some(keyword => 
      text.toLowerCase().includes(keyword)
    );

    let score = hasEducationSection ? 80 : 20;
    const suggestions = [];

    if (!hasEducationSection) {
      suggestions.push('Add an education section with your qualifications');
    }

    return {
      score,
      found: hasEducationSection,
      suggestions
    };
  }

  // Analyze skills section
  analyzeSkills(text) {
    const skillsKeywords = ['skills', 'technologies', 'competencies', 'expertise'];
    const hasSkillsSection = skillsKeywords.some(keyword => 
      text.toLowerCase().includes(keyword)
    );

    // Common technical skills
    const technicalSkills = [
      'javascript', 'python', 'java', 'react', 'node.js', 'sql', 'html', 'css',
      'mongodb', 'postgresql', 'aws', 'docker', 'kubernetes', 'git', 'agile'
    ];

    const extractedSkills = technicalSkills.filter(skill => 
      text.toLowerCase().includes(skill.toLowerCase())
    );

    let score = 0;
    const suggestions = [];

    if (hasSkillsSection) score += 40;
    else suggestions.push('Add a dedicated skills section');

    if (extractedSkills.length >= 5) score += 60;
    else if (extractedSkills.length >= 3) score += 40;
    else suggestions.push('Include more relevant technical skills');

    return {
      score,
      found: hasSkillsSection,
      extractedSkills,
      suggestions
    };
  }

  // Analyze formatting
  analyzeFormatting(text) {
    const lines = text.split('\n');
    const hasConsistentFormatting = lines.length > 10; // Basic check
    
    let score = hasConsistentFormatting ? 70 : 40;
    const suggestions = [];

    if (!hasConsistentFormatting) {
      suggestions.push('Ensure consistent formatting throughout your resume');
    }

    // Check for bullet points
    const hasBulletPoints = text.includes('•') || text.includes('-') || text.includes('*');
    if (hasBulletPoints) score += 30;
    else suggestions.push('Use bullet points to organize information clearly');

    return {
      score,
      suggestions
    };
  }

  // Extract keywords using NLP
  extractKeywords(text) {
    const words = this.tokenizer.tokenize(text.toLowerCase());
    const filteredWords = words.filter(word => 
      word.length > 3 && 
      !natural.stopwords.includes(word)
    );

    // Get word frequency
    const wordFreq = {};
    filteredWords.forEach(word => {
      const stemmed = this.stemmer.stem(word);
      wordFreq[stemmed] = (wordFreq[stemmed] || 0) + 1;
    });

    // Return top keywords
    return Object.entries(wordFreq)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([word]) => word);
  }

  // Calculate overall score
  calculateOverallScore(sections) {
    const scores = Object.values(sections).map(section => section.score || 0);
    return Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
  }

  // Check ATS compatibility
  checkATSCompatibility(text, sections) {
    let score = 80; // Start with high score
    const issues = [];
    const suggestions = [];

    // Check for common ATS issues
    if (text.includes('│') || text.includes('┌') || text.includes('└')) {
      score -= 20;
      issues.push('Contains special characters that may not be ATS-friendly');
      suggestions.push('Remove special characters and use simple formatting');
    }

    if (!sections.contactInfo.found) {
      score -= 30;
      issues.push('Missing contact information');
      suggestions.push('Ensure contact information is clearly visible');
    }

    if (!sections.skills.found) {
      score -= 20;
      issues.push('No dedicated skills section found');
      suggestions.push('Add a skills section with relevant keywords');
    }

    return {
      score: Math.max(0, score),
      issues,
      suggestions
    };
  }

  // Generate AI-powered recommendations using OpenAI
  async generateOpenAIRecommendations(text, analysis) {
    try {
      console.log('🚀 Calling OpenAI API for resume analysis...');
      
      const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
      });

      const prompt = `
        Analyze this resume and provide specific recommendations for improvement:
        
        Resume Text: ${text.substring(0, 2000)}...
        
        Current Scores:
        - Contact Info: ${analysis.sections.contactInfo.score}/100
        - Experience: ${analysis.sections.experience.score}/100
        - Skills: ${analysis.sections.skills.score}/100
        - Education: ${analysis.sections.education.score}/100
        
        Please provide:
        1. Top 3 strengths
        2. Top 3 weaknesses  
        3. 5 specific recommendations for improvement
        
        Return ONLY a valid JSON object with keys: strengths (array), weaknesses (array), recommendations (array)
        Example format:
        {
          "strengths": ["strength 1", "strength 2", "strength 3"],
          "weaknesses": ["weakness 1", "weakness 2", "weakness 3"],
          "recommendations": ["rec 1", "rec 2", "rec 3", "rec 4", "rec 5"]
        }
      `;

      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 1000
      });

      const response = completion.choices[0].message.content;
      console.log('✅ OpenAI API response received successfully');
      console.log('📝 Response preview:', response.substring(0, 100) + '...');
      
      // Clean up the response to extract JSON
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsedResponse = JSON.parse(jsonMatch[0]);
        console.log('🎯 Successfully parsed AI recommendations');
        return parsedResponse;
      } else {
        throw new Error('Invalid JSON response from OpenAI');
      }
    } catch (error) {
      console.error('❌ OpenAI API error:', error.message);
      console.log('🔄 Falling back to rule-based recommendations');
      return this.generateRuleBasedRecommendations(analysis.sections);
    }
  }

  // Generate AI-powered recommendations using Gemini
  async generateGeminiRecommendations(text, analysis) {
    try {
      console.log('🚀 Calling Gemini API for resume analysis...');
      
      // Get the working model
      const { model, modelName } = await getCachedModel();
      console.log(`📋 Using model: ${modelName}`);
      
      const prompt = `
        Analyze this resume and provide specific recommendations for improvement:
        
        Resume Text: ${text.substring(0, 2000)}...
        
        Current Scores:
        - Contact Info: ${analysis.sections.contactInfo.score}/100
        - Experience: ${analysis.sections.experience.score}/100
        - Skills: ${analysis.sections.skills.score}/100
        - Education: ${analysis.sections.education.score}/100
        
        Please provide:
        1. Top 3 strengths
        2. Top 3 weaknesses  
        3. 5 specific recommendations for improvement
        
        Return ONLY a valid JSON object with keys: strengths (array), weaknesses (array), recommendations (array)
        Example format:
        {
          "strengths": ["strength 1", "strength 2", "strength 3"],
          "weaknesses": ["weakness 1", "weakness 2", "weakness 3"],
          "recommendations": ["rec 1", "rec 2", "rec 3", "rec 4", "rec 5"]
        }
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text_response = response.text();
      
      console.log('✅ Gemini API response received successfully');
      console.log('📝 Response preview:', text_response.substring(0, 100) + '...');
      
      // Clean up the response to extract JSON
      const jsonMatch = text_response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsedResponse = JSON.parse(jsonMatch[0]);
        console.log('🎯 Successfully parsed AI recommendations');
        return parsedResponse;
      } else {
        throw new Error('Invalid JSON response from Gemini');
      }
    } catch (error) {
      console.error('❌ Gemini API error:', error.message);
      console.log('🔄 Falling back to rule-based recommendations');
      return this.generateRuleBasedRecommendations(analysis.sections);
    }
  }

  // Fallback rule-based recommendations
  generateRuleBasedRecommendations(sections) {
    const recommendations = [];
    const strengths = [];
    const weaknesses = [];

    // Analyze strengths
    if (sections.contactInfo.score >= 80) strengths.push('Complete contact information');
    if (sections.experience.score >= 80) strengths.push('Strong work experience section');
    if (sections.skills.score >= 80) strengths.push('Comprehensive skills listing');

    // Analyze weaknesses
    if (sections.contactInfo.score < 60) weaknesses.push('Incomplete contact information');
    if (sections.summary.score < 60) weaknesses.push('Missing or weak professional summary');
    if (sections.skills.score < 60) weaknesses.push('Limited skills section');

    // Generate recommendations
    if (sections.summary.score < 70) {
      recommendations.push('Add a compelling professional summary highlighting your key achievements');
    }
    if (sections.experience.score < 70) {
      recommendations.push('Use more action verbs and quantify your achievements with numbers');
    }
    if (sections.skills.score < 70) {
      recommendations.push('Include more relevant technical and soft skills');
    }
    recommendations.push('Tailor your resume to specific job descriptions');
    recommendations.push('Keep your resume to 1-2 pages maximum');

    return { recommendations, strengths, weaknesses };
  }
}

module.exports = new ResumeAnalyzer();
