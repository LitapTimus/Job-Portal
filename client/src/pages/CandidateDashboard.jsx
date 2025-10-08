import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function CandidateDashboard() {
  const { user, logout } = useAuth();

  const { data: applications } = useQuery('myApplications', async () => {
    const { data } = await api.get('/applications/my');
    return data;
  });

  const { data: analytics } = useQuery('candidateAnalytics', async () => {
    const { data } = await api.get('/analytics/candidate');
    return data;
  });

  const statusColors = {
    applied: 'bg-blue-100 text-blue-800',
    viewed: 'bg-yellow-100 text-yellow-800',
    shortlisted: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    hired: 'bg-purple-100 text-purple-800'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <nav className="bg-white/80 backdrop-blur-md shadow-lg border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link to="/" className="text-2xl font-bold text-gradient hover-glow transition-all duration-300">
              JobPortal
            </Link>
            <div className="flex gap-2 items-center">
              <Link 
                to="/profile" 
                className="px-4 py-2 text-indigo-600 hover:text-indigo-800 rounded-lg hover:bg-indigo-50 transition-all duration-200 font-medium"
              >
                My Profile
              </Link>
              <Link 
                to="/resume-analyzer" 
                className="px-4 py-2 text-purple-600 hover:text-purple-800 rounded-lg hover:bg-purple-50 transition-all duration-200 font-medium"
              >
                Resume Analyzer
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
        <div className="flex justify-between items-center mb-8 animate-fadeIn">
          <div>
            <h1 className="text-4xl font-bold text-gradient mb-2">Welcome back, {user?.name}! 👋</h1>
            <p className="text-gray-600 text-lg">Track your job applications and career progress</p>
          </div>
          {!user?.skills || user.skills.length === 0 ? (
            <Link
              to="/profile"
              className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-xl hover:shadow-lg hover:scale-105 font-semibold transition-all duration-300 animate-pulse-glow"
            >
              ✨ Complete Your Profile
            </Link>
          ) : null}
        </div>

        {/* Analytics Cards */}
        {analytics && (
          <>
            <div className="grid md:grid-cols-5 gap-6 mb-8 animate-slideUp">
              <div className="card-modern p-6 rounded-2xl hover-lift group">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-gray-600 text-sm font-medium">Total Applications</p>
                  <div className="p-2 bg-indigo-100 rounded-lg group-hover:bg-indigo-200 transition-colors">
                    <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                </div>
                <p className="text-3xl font-bold text-indigo-600">{analytics.totalApplications}</p>
              </div>
              <div className="card-modern p-6 rounded-2xl hover-lift group">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-gray-600 text-sm font-medium">Applied</p>
                  <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </div>
                </div>
                <p className="text-3xl font-bold text-blue-600">{analytics.applicationsByStatus.applied}</p>
              </div>
              <div className="card-modern p-6 rounded-2xl hover-lift group">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-gray-600 text-sm font-medium">Shortlisted</p>
                  <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <p className="text-3xl font-bold text-green-600">{analytics.applicationsByStatus.shortlisted}</p>
              </div>
              <div className="card-modern p-6 rounded-2xl hover-lift group">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-gray-600 text-sm font-medium">Rejected</p>
                  <div className="p-2 bg-red-100 rounded-lg group-hover:bg-red-200 transition-colors">
                    <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <p className="text-3xl font-bold text-red-600">{analytics.applicationsByStatus.rejected}</p>
              </div>
              <div className="card-modern p-6 rounded-2xl hover-lift group">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-gray-600 text-sm font-medium">Hired</p>
                  <div className="p-2 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                  </div>
                </div>
                <p className="text-3xl font-bold text-purple-600">{analytics.applicationsByStatus.hired}</p>
              </div>
            </div>

            {/* Success Rate */}
            {analytics.totalApplications > 0 && (
              <div className="card-modern p-8 rounded-2xl mb-8 hover-lift animate-scaleIn">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Application Success Rate</h3>
                </div>
                <div className="flex items-center gap-6">
                  <div className="flex-1">
                    <div className="flex justify-between text-sm mb-3">
                      <span className="font-medium text-gray-600">Success Rate</span>
                      <span className="font-bold text-green-600 text-lg">
                        {Math.round(((analytics.applicationsByStatus.shortlisted + analytics.applicationsByStatus.hired) / analytics.totalApplications) * 100)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-green-500 to-emerald-500 h-6 rounded-full transition-all duration-1000 ease-out"
                        style={{
                          width: `${((analytics.applicationsByStatus.shortlisted + analytics.applicationsByStatus.hired) / analytics.totalApplications) * 100}%`
                        }}
                      />
                    </div>
                  </div>
                  <div className="text-center px-6 border-l border-gray-200">
                    <p className="text-3xl font-bold text-green-600 mb-1">
                      {analytics.applicationsByStatus.shortlisted + analytics.applicationsByStatus.hired}
                    </p>
                    <p className="text-sm text-gray-600 font-medium">Positive Responses</p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* Resume Analyzer Quick Access */}
        <div className="card-modern p-8 rounded-2xl mb-8 animate-scaleIn bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">AI Resume Analyzer</h3>
                <p className="text-gray-600">Get instant feedback and improve your resume with AI-powered insights</p>
              </div>
            </div>
            <Link
              to="/resume-analyzer"
              className="btn-gradient text-white px-6 py-3 rounded-xl font-semibold hover-lift inline-flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              Analyze Resume
            </Link>
          </div>
        </div>

        {/* Applications List */}
        <div className="card-modern rounded-2xl overflow-hidden animate-slideUp">
          <div className="px-8 py-6 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-purple-50">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">My Applications</h2>
            </div>
          </div>
          <div className="p-8">
            {applications && applications.length > 0 ? (
              <div className="space-y-6">
                {applications.map((app, index) => (
                  <div key={app._id} className="card-modern border border-gray-100 rounded-2xl p-6 hover-lift group" style={{animationDelay: `${index * 0.1}s`}}>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <Link
                          to={`/jobs/${app.job._id}`}
                          className="text-xl font-bold text-indigo-600 hover:text-indigo-800 transition-colors group-hover:text-indigo-700"
                        >
                          {app.job.title}
                        </Link>
                        <div className="flex items-center gap-2 mt-2">
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          </svg>
                          <p className="text-gray-600 font-medium">{app.job.location}</p>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0h6m-6 0l-2 9a1 1 0 001 1h8a1 1 0 001-1l-2-9m-6 0h6" />
                          </svg>
                          <p className="text-sm text-gray-500">
                            Applied on {new Date(app.appliedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                          </p>
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <span className={`px-4 py-2 rounded-xl text-sm font-semibold ${statusColors[app.status]} shadow-sm`}>
                          {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                        </span>
                      </div>
                    </div>
                    {app.coverLetter && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <div className="bg-gray-50 rounded-xl p-4">
                          <p className="text-sm text-gray-600 mb-1">
                            <span className="font-semibold text-gray-800">📝 Cover Letter:</span>
                          </p>
                          <p className="text-sm text-gray-700 leading-relaxed">{app.coverLetter}</p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 animate-fadeIn">
                <div className="inline-block p-6 bg-gray-100 rounded-full mb-6">
                  <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No Applications Yet</h3>
                <p className="text-gray-500 mb-8 max-w-md mx-auto">Start your job search journey by exploring available opportunities and applying to positions that match your skills.</p>
                <Link
                  to="/jobs"
                  className="btn-gradient text-white px-8 py-3 rounded-xl font-semibold hover-lift inline-flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Browse Jobs
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}