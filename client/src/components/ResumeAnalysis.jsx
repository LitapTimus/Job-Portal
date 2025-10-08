import { useState } from 'react';

export default function ResumeAnalysis({ analysis, onReAnalyze }) {
  const [activeTab, setActiveTab] = useState('overview');

  if (!analysis) {
    return (
      <div className="card-modern p-8 rounded-2xl text-center">
        <div className="inline-block p-4 bg-gray-100 rounded-full mb-4">
          <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">No Resume Analysis Available</h3>
        <p className="text-gray-500">Upload your resume to get detailed analysis and improvement suggestions.</p>
      </div>
    );
  }

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getScoreGradient = (score) => {
    if (score >= 80) return 'from-green-500 to-emerald-500';
    if (score >= 60) return 'from-yellow-500 to-orange-500';
    return 'from-red-500 to-pink-500';
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'sections', label: 'Sections', icon: '📋' },
    { id: 'recommendations', label: 'Recommendations', icon: '💡' },
    { id: 'ats', label: 'ATS Check', icon: '🤖' }
  ];

  return (
    <div className="space-y-6">
      {/* Overall Score Card */}
      <div className="card-modern p-8 rounded-2xl text-center animate-fadeIn">
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Resume Analysis</h2>
            <p className="text-gray-600">AI-powered insights and recommendations</p>
          </div>
        </div>

        <div className="relative inline-block">
          <div className="w-32 h-32 rounded-full border-8 border-gray-200 flex items-center justify-center relative overflow-hidden">
            <div 
              className={`absolute inset-0 rounded-full bg-gradient-to-r ${getScoreGradient(analysis.overallScore)} opacity-20`}
              style={{
                background: `conic-gradient(from 0deg, rgb(99, 102, 241) 0%, rgb(99, 102, 241) ${analysis.overallScore * 3.6}deg, rgb(229, 231, 235) ${analysis.overallScore * 3.6}deg, rgb(229, 231, 235) 360deg)`
              }}
            ></div>
            <div className="relative z-10">
              <div className="text-4xl font-bold text-gray-900">{analysis.overallScore}</div>
              <div className="text-sm text-gray-600">/ 100</div>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-2">
            {analysis.overallScore >= 80 ? 'Excellent Resume! 🎉' : 
             analysis.overallScore >= 60 ? 'Good Resume 👍' : 
             'Needs Improvement 📈'}
          </h3>
          <p className="text-gray-600 max-w-2xl mx-auto mb-4">
            {analysis.overallScore >= 80 ? 
              'Your resume is well-structured and comprehensive. Minor tweaks could make it even better.' :
             analysis.overallScore >= 60 ?
              'Your resume has good foundation but there\'s room for improvement in several areas.' :
              'Your resume needs significant improvements to stand out to employers and pass ATS systems.'}
          </p>
          
          {/* AI Powered Indicator */}
          <div className="flex justify-center">
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
              analysis.aiPowered 
                ? 'bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-700 border border-purple-200' 
                : 'bg-gray-100 text-gray-600 border border-gray-200'
            }`}>
              {analysis.aiPowered ? (
                <>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                  </svg>
                  Powered by AI
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                  Rule-based Analysis
                </>
              )}
            </div>
          </div>
        </div>

        <button
          onClick={onReAnalyze}
          className="mt-6 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300"
        >
          Re-analyze Resume
        </button>
      </div>

      {/* Tabs */}
      <div className="card-modern rounded-2xl overflow-hidden animate-slideUp">
        <div className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
          <div className="flex">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 px-6 py-4 text-sm font-semibold transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'text-indigo-600 border-b-2 border-indigo-600 bg-white'
                    : 'text-gray-600 hover:text-indigo-600 hover:bg-gray-50'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-8">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Strengths */}
                <div className="bg-green-50 p-6 rounded-xl border border-green-200">
                  <div className="flex items-center gap-2 mb-4">
                    <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <h4 className="text-lg font-bold text-green-800">Strengths</h4>
                  </div>
                  <ul className="space-y-2">
                    {analysis.strengths?.map((strength, index) => (
                      <li key={index} className="text-green-700 flex items-start gap-2">
                        <span className="text-green-500 mt-1">•</span>
                        {strength}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Weaknesses */}
                <div className="bg-red-50 p-6 rounded-xl border border-red-200">
                  <div className="flex items-center gap-2 mb-4">
                    <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <h4 className="text-lg font-bold text-red-800">Areas for Improvement</h4>
                  </div>
                  <ul className="space-y-2">
                    {analysis.weaknesses?.map((weakness, index) => (
                      <li key={index} className="text-red-700 flex items-start gap-2">
                        <span className="text-red-500 mt-1">•</span>
                        {weakness}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Keywords */}
              {analysis.keywords && analysis.keywords.length > 0 && (
                <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
                  <h4 className="text-lg font-bold text-blue-800 mb-4">Key Terms Found</h4>
                  <div className="flex flex-wrap gap-2">
                    {analysis.keywords.map((keyword, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Sections Tab */}
          {activeTab === 'sections' && (
            <div className="space-y-4 animate-fadeIn">
              {Object.entries(analysis.sections).map(([sectionName, sectionData]) => (
                <div key={sectionName} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-lg font-semibold capitalize text-gray-900">
                      {sectionName.replace(/([A-Z])/g, ' $1').trim()}
                    </h4>
                    <div className={`px-3 py-1 rounded-full text-sm font-bold ${getScoreColor(sectionData.score)}`}>
                      {sectionData.score}/100
                    </div>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                    <div
                      className={`h-3 rounded-full bg-gradient-to-r ${getScoreGradient(sectionData.score)} transition-all duration-1000`}
                      style={{ width: `${sectionData.score}%` }}
                    ></div>
                  </div>

                  {sectionData.suggestions && sectionData.suggestions.length > 0 && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h5 className="font-semibold text-gray-700 mb-2">Suggestions:</h5>
                      <ul className="space-y-1">
                        {sectionData.suggestions.map((suggestion, index) => (
                          <li key={index} className="text-gray-600 text-sm flex items-start gap-2">
                            <span className="text-indigo-500 mt-1">→</span>
                            {suggestion}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {sectionData.extractedSkills && sectionData.extractedSkills.length > 0 && (
                    <div className="mt-4">
                      <h5 className="font-semibold text-gray-700 mb-2">Skills Found:</h5>
                      <div className="flex flex-wrap gap-2">
                        {sectionData.extractedSkills.map((skill, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded text-sm"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Recommendations Tab */}
          {activeTab === 'recommendations' && (
            <div className="space-y-4 animate-fadeIn">
              {analysis.recommendations?.map((recommendation, index) => (
                <div key={index} className="flex gap-4 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-200">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                      <span className="text-indigo-600 font-bold text-sm">{index + 1}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-800 font-medium">{recommendation}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ATS Tab */}
          {activeTab === 'ats' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="text-center">
                <div className={`inline-block px-6 py-3 rounded-full text-lg font-bold ${getScoreColor(analysis.atsCompatibility?.score || 0)}`}>
                  ATS Score: {analysis.atsCompatibility?.score || 0}/100
                </div>
                <p className="text-gray-600 mt-2">
                  {(analysis.atsCompatibility?.score || 0) >= 80 ? 
                    'Your resume is highly compatible with ATS systems' :
                   (analysis.atsCompatibility?.score || 0) >= 60 ?
                    'Your resume has good ATS compatibility with some improvements needed' :
                    'Your resume may face challenges with ATS systems'}
                </p>
              </div>

              {analysis.atsCompatibility?.issues && analysis.atsCompatibility.issues.length > 0 && (
                <div className="bg-red-50 p-6 rounded-xl border border-red-200">
                  <h4 className="text-lg font-bold text-red-800 mb-4">ATS Issues Found</h4>
                  <ul className="space-y-2">
                    {analysis.atsCompatibility.issues.map((issue, index) => (
                      <li key={index} className="text-red-700 flex items-start gap-2">
                        <svg className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {issue}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {analysis.atsCompatibility?.suggestions && analysis.atsCompatibility.suggestions.length > 0 && (
                <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
                  <h4 className="text-lg font-bold text-blue-800 mb-4">ATS Improvement Tips</h4>
                  <ul className="space-y-2">
                    {analysis.atsCompatibility.suggestions.map((suggestion, index) => (
                      <li key={index} className="text-blue-700 flex items-start gap-2">
                        <svg className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
