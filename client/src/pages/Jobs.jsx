import { useState } from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function Jobs() {
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const { user, logout } = useAuth();

  const { data: jobs, isLoading } = useQuery(['jobs', search, location], async () => {
    const params = {};
    if (search) params.q = search;
    if (location) params.location = location;
    const { data } = await api.get('/jobs', { params });
    return data;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md shadow-lg border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link to="/" className="text-2xl font-bold text-gradient hover-glow transition-all duration-300">
              JobPortal
            </Link>
            <div className="flex gap-2 items-center">
              {user ? (
                <>
                  <Link
                    to={user.role === 'candidate' ? '/dashboard/candidate' : '/dashboard/recruiter'}
                    className="px-4 py-2 text-indigo-600 hover:text-indigo-800 rounded-lg hover:bg-indigo-50 transition-all duration-200 font-medium"
                  >
                    Dashboard
                  </Link>
                  {user.role === 'recruiter' && (
                    <Link
                      to="/post-job"
                      className="btn-gradient text-white px-4 py-2 rounded-lg hover-lift font-medium"
                    >
                      Post Job
                    </Link>
                  )}
                  <button
                    onClick={logout}
                    className="px-4 py-2 text-gray-600 hover:text-red-600 rounded-lg hover:bg-red-50 transition-all duration-200 font-medium"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="px-4 py-2 text-indigo-600 hover:text-indigo-800 rounded-lg hover:bg-indigo-50 transition-all duration-200 font-medium">
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="btn-gradient text-white px-4 py-2 rounded-lg hover-lift font-medium"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Search Section */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 shadow-2xl py-16 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full animate-float"></div>
          <div className="absolute bottom-10 right-10 w-24 h-24 bg-white/10 rounded-full animate-float" style={{animationDelay: '1s'}}></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white/10 rounded-full animate-float" style={{animationDelay: '2s'}}></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12 animate-fadeIn">
            <h1 className="text-5xl font-bold text-white mb-4">
              Discover Your 
              <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent"> Dream Job</span>
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">Find opportunities that match your skills and aspirations from top companies worldwide</p>
          </div>
          
          <div className="flex gap-4 max-w-5xl mx-auto animate-slideUp">
            <div className="flex-1 relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition-opacity"></div>
              <div className="relative">
                <svg className="absolute left-6 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400 z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Job title, keywords, or company..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-16 pr-6 py-5 border-0 rounded-2xl focus:outline-none focus:ring-4 focus:ring-white/30 shadow-2xl text-lg bg-white/95 backdrop-blur-sm placeholder-gray-500 font-medium transition-all duration-300"
                />
              </div>
            </div>
            <div className="w-80 relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition-opacity"></div>
              <div className="relative">
                <svg className="absolute left-6 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400 z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full pl-16 pr-6 py-5 border-0 rounded-2xl focus:outline-none focus:ring-4 focus:ring-white/30 shadow-2xl text-lg bg-white/95 backdrop-blur-sm placeholder-gray-500 font-medium transition-all duration-300"
                />
              </div>
            </div>
            <button className="px-8 py-5 bg-white text-indigo-600 rounded-2xl font-bold text-lg hover:bg-gray-50 hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-3xl">
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Jobs List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {isLoading ? (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
            <p className="text-gray-600 text-lg">Finding amazing opportunities for you...</p>
          </div>
        ) : jobs && jobs.length > 0 ? (
          <>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900">Available Positions</h2>
              <p className="text-gray-600">{jobs.length} jobs found</p>
            </div>
            <div className="space-y-6">
              {jobs.map((job, index) => (
                <Link
                  key={job._id}
                  to={`/jobs/${job._id}`}
                  className="group block card-modern p-8 rounded-3xl hover-lift border border-gray-100 animate-slideUp"
                  style={{animationDelay: `${index * 0.1}s`}}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-2xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors mb-2">{job.title}</h3>
                          <div className="flex items-center gap-2 mb-3">
                            <div className="p-1 bg-gray-100 rounded">
                              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                              </svg>
                            </div>
                            <span className="text-gray-700 font-semibold text-lg">
                              {job.recruiter?.companyName || job.recruiter?.name}
                            </span>
                          </div>
                          <div className="flex items-center gap-6 mb-4 text-gray-600">
                            <span className="flex items-center gap-2">
                              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              </svg>
                              <span className="font-medium">{job.location}</span>
                            </span>
                            <span className="px-4 py-2 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 rounded-xl text-sm font-semibold border border-blue-200">
                              {job.employmentType}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {job.requiredSkills?.slice(0, 6).map((skill, idx) => (
                              <span
                                key={idx}
                                className="px-3 py-1 bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 rounded-lg text-sm font-medium border border-indigo-100 hover:bg-indigo-100 transition-colors"
                              >
                                {skill}
                              </span>
                            ))}
                            {job.requiredSkills?.length > 6 && (
                              <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium">
                                +{job.requiredSkills.length - 6} more
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right ml-8">
                      {job.salaryRange && (
                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 px-6 py-4 rounded-2xl border border-green-200 group-hover:shadow-lg transition-shadow">
                          <div className="flex items-center gap-2 mb-1">
                            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                            </svg>
                            <p className="text-sm text-green-600 font-semibold">Salary Range</p>
                          </div>
                          <p className="text-xl font-bold text-green-700">
                            ${job.salaryRange.min}k - ${job.salaryRange.max}k
                          </p>
                        </div>
                      )}
                      <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-sm text-indigo-600 font-medium">View Details →</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-20 animate-fadeIn">
            <div className="inline-block p-8 bg-gray-100 rounded-full mb-6">
              <svg className="w-20 h-20 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-gray-700 mb-3">No Jobs Found</h3>
            <p className="text-gray-500 mb-8 max-w-md mx-auto text-lg">We couldn't find any positions matching your search criteria. Try adjusting your filters or search terms.</p>
            <button 
              onClick={() => {setSearch(''); setLocation('');}}
              className="btn-gradient text-white px-8 py-3 rounded-xl font-semibold hover-lift inline-flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}