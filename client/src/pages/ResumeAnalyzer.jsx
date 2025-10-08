import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useAuth } from '../context/AuthContext';
import ResumeUpload from '../components/ResumeUpload';
import ResumeAnalysis from '../components/ResumeAnalysis';
import api from '../api/axios';

export default function ResumeAnalyzer() {
  const { user, logout } = useAuth();
  const queryClient = useQueryClient();
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState('');

  // Fetch current resume analysis
  const { data: resumeData, isLoading, refetch } = useQuery(
    'resumeAnalysis',
    async () => {
      const { data } = await api.get('/resume/analysis');
      return data;
    },
    {
      retry: false,
      refetchOnWindowFocus: false
    }
  );

  // Re-analyze mutation
  const reAnalyzeMutation = useMutation(
    async (resumeId) => {
      const { data } = await api.post(`/resume/${resumeId}/reanalyze`);
      return data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('resumeAnalysis');
        setUploadSuccess(true);
        setTimeout(() => setUploadSuccess(false), 3000);
      },
      onError: (error) => {
        setUploadError(error.response?.data?.msg || 'Re-analysis failed');
        setTimeout(() => setUploadError(''), 5000);
      }
    }
  );

  const handleUploadSuccess = (data) => {
    setUploadSuccess(true);
    setUploadError('');
    queryClient.invalidateQueries('resumeAnalysis');
    setTimeout(() => setUploadSuccess(false), 3000);
  };

  const handleUploadError = (error) => {
    setUploadError(error);
    setUploadSuccess(false);
    setTimeout(() => setUploadError(''), 5000);
  };

  const handleReAnalyze = () => {
    if (resumeData?._id) {
      reAnalyzeMutation.mutate(resumeData._id);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md shadow-lg border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link to="/" className="text-2xl font-bold text-gradient hover-glow transition-all duration-300">
              JobPortal
            </Link>
            <div className="flex gap-2 items-center">
              <Link 
                to="/dashboard/candidate" 
                className="px-4 py-2 text-indigo-600 hover:text-indigo-800 rounded-lg hover:bg-indigo-50 transition-all duration-200 font-medium"
              >
                Dashboard
              </Link>
              <Link 
                to="/jobs" 
                className="px-4 py-2 text-indigo-600 hover:text-indigo-800 rounded-lg hover:bg-indigo-50 transition-all duration-200 font-medium"
              >
                Browse Jobs
              </Link>
              <button
                onClick={logout}
                className="px-4 py-2 text-gray-600 hover:text-red-600 rounded-lg hover:bg-red-50 transition-all duration-200 font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12 animate-fadeIn">
          <div className="inline-block p-4 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl mb-6 animate-pulse-glow">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h1 className="text-5xl font-bold text-gradient mb-4">
            AI Resume Analyzer
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get instant, AI-powered feedback on your resume. Improve your chances of landing interviews with personalized recommendations and ATS optimization tips.
          </p>
        </div>

        {/* Success/Error Messages */}
        {uploadSuccess && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl animate-scaleIn">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="font-semibold">Success!</span>
              Resume analyzed successfully. Check your results below.
            </div>
          </div>
        )}

        {uploadError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl animate-scaleIn">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span className="font-semibold">Error:</span>
              {uploadError}
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div className="space-y-6">
            <ResumeUpload 
              onUploadSuccess={handleUploadSuccess}
              onUploadError={handleUploadError}
            />

            {/* Features List */}
            <div className="card-modern p-6 rounded-2xl">
              <h3 className="text-xl font-bold text-gray-900 mb-4">What You'll Get</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-gray-700 font-medium">Overall resume score (0-100)</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-gray-700 font-medium">Section-by-section analysis</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-gray-700 font-medium">ATS compatibility check</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-gray-700 font-medium">Personalized improvement tips</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-gray-700 font-medium">Keyword optimization suggestions</span>
                </div>
              </div>
            </div>
          </div>

          {/* Analysis Results */}
          <div>
            {isLoading ? (
              <div className="card-modern p-8 rounded-2xl text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
                <p className="text-gray-600">Loading your resume analysis...</p>
              </div>
            ) : (
              <ResumeAnalysis 
                analysis={resumeData?.analysis} 
                onReAnalyze={handleReAnalyze}
              />
            )}
          </div>
        </div>

        {/* Tips Section */}
        <div className="mt-16 card-modern p-8 rounded-2xl animate-slideUp">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Resume Optimization Tips</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="inline-block p-4 bg-blue-100 rounded-full mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h4 className="text-lg font-semibold mb-2">Use Keywords</h4>
              <p className="text-gray-600">Include relevant industry keywords and skills mentioned in job descriptions.</p>
            </div>
            <div className="text-center">
              <div className="inline-block p-4 bg-green-100 rounded-full mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h4 className="text-lg font-semibold mb-2">Quantify Results</h4>
              <p className="text-gray-600">Use numbers and metrics to demonstrate your achievements and impact.</p>
            </div>
            <div className="text-center">
              <div className="inline-block p-4 bg-purple-100 rounded-full mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h4 className="text-lg font-semibold mb-2">Keep It Simple</h4>
              <p className="text-gray-600">Use clean formatting and avoid complex graphics that may confuse ATS systems.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
