// Alternative OpenAI-based resume analyzer
const OpenAI = require('openai');

class OpenAIResumeAnalyzer {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || 'your-openai-key-here'
    });
  }

  async generateRecommendations(text, analysis) {
    try {
      console.log('🤖 Using OpenAI for resume analysis...');
      
      if (!process.env.OPENAI_API_KEY) {
        throw new Error('OPENAI_API_KEY not configured');
      }

      const prompt = `
        Analyze this resume and provide specific recommendations:
        
        Resume Text: ${text.substring(0, 2000)}...
        
        Current Scores:
        - Contact Info: ${analysis.sections.contactInfo.score}/100
        - Experience: ${analysis.sections.experience.score}/100
        - Skills: ${analysis.sections.skills.score}/100
        - Education: ${analysis.sections.education.score}/100
        
        Provide a JSON response with:
        {
          "strengths": ["strength1", "strength2", "strength3"],
          "weaknesses": ["weakness1", "weakness2", "weakness3"],
          "recommendations": ["rec1", "rec2", "rec3", "rec4", "rec5"]
        }
      `;

      const completion = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 1000
      });

      const response = completion.choices[0].message.content;
      console.log('✅ OpenAI response received');
      
      // Parse JSON response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('Invalid JSON response from OpenAI');
      }

    } catch (error) {
      console.error('❌ OpenAI error:', error.message);
      // Fallback to rule-based
      return this.generateRuleBasedRecommendations(analysis.sections);
    }
  }

  generateRuleBasedRecommendations(sections) {
    return {
      strengths: ["Resume structure is clear", "Contact information provided"],
      weaknesses: ["Could use more specific achievements", "Missing keywords"],
      recommendations: [
        "Add quantifiable achievements with numbers",
        "Include relevant industry keywords",
        "Improve formatting and consistency",
        "Add a professional summary",
        "Include relevant certifications"
      ]
    };
  }
}

module.exports = OpenAIResumeAnalyzer;
