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
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link to="/" className="text-2xl font-bold text-indigo-600">JobPortal</Link>
            <div className="flex gap-4 items-center">
              {user ? (
                <>
                  <Link
                    to={user.role === 'candidate' ? '/dashboard/candidate' : '/dashboard/recruiter'}
                    className="px-4 py-2 text-indigo-600 hover:text-indigo-800"
                  >
                    Dashboard
                  </Link>
                  {user.role === 'recruiter' && (
                    <Link
                      to="/post-job"
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                    >
                      Post Job
                    </Link>
                  )}
                  <button
                    onClick={logout}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="px-4 py-2 text-indigo-600 hover:text-indigo-800">
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
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
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-white mb-8 text-center">Discover Your Perfect Job</h1>
          <div className="flex gap-4 max-w-4xl mx-auto">
            <div className="flex-1 relative">
              <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Job title, keywords, or company..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-white shadow-lg text-lg"
              />
            </div>
            <div className="w-72 relative">
              <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <input
                type="text"
                placeholder="Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-white shadow-lg text-lg"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Jobs List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="text-center py-12">Loading jobs...</div>
        ) : jobs && jobs.length > 0 ? (
          <div className="space-y-4">
            {jobs.map((job) => (
              <Link
                key={job._id}
                to={`/jobs/${job._id}`}
                className="group block bg-white p-6 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-gray-100"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{job.title}</h3>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-gray-700 font-medium">
                        {job.recruiter?.companyName || job.recruiter?.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 mt-3 text-gray-600">
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        </svg>
                        {job.location}
                      </span>
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                        {job.employmentType}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-4">
                      {job.requiredSkills?.slice(0, 5).map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 rounded-lg text-sm font-medium border border-indigo-100"
                        >
                          {skill}
                        </span>
                      ))}
                      {job.requiredSkills?.length > 5 && (
                        <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-sm">
                          +{job.requiredSkills.length - 5} more
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right ml-6">
                    {job.salaryRange && (
                      <div className="bg-green-50 px-4 py-2 rounded-lg border border-green-200">
                        <p className="text-sm text-green-600 font-medium">Salary</p>
                        <p className="text-lg font-bold text-green-700">
                          ${job.salaryRange.min}k - ${job.salaryRange.max}k
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            No jobs found. Try adjusting your search criteria.
          </div>
        )}
      </div>
    </div>
  );
}