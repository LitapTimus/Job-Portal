import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function CandidateSearch() {
  const { user, logout } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [skillFilter, setSkillFilter] = useState('');
  const [experienceFilter, setExperienceFilter] = useState('');

  const { data: candidates, isLoading } = useQuery(
    ['candidates', searchTerm, skillFilter, experienceFilter],
    async () => {
      const params = {};
      if (searchTerm) params.q = searchTerm;
      if (skillFilter) params.skills = skillFilter;
      if (experienceFilter) params.experience = experienceFilter;
      const { data } = await api.get('/users/candidates', { params });
      return data;
    }
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link to="/" className="text-2xl font-bold text-indigo-600">JobPortal</Link>
            <div className="flex gap-4 items-center">
              <Link to="/dashboard/recruiter" className="px-4 py-2 text-indigo-600 hover:text-indigo-800">
                Dashboard
              </Link>
              <Link to="/post-job" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                Post Job
              </Link>
              <button onClick={logout} className="px-4 py-2 text-gray-600 hover:text-gray-800">
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Search Candidates</h1>

        {/* Search Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search by Name/Title
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search candidates..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Skills
              </label>
              <input
                type="text"
                value={skillFilter}
                onChange={(e) => setSkillFilter(e.target.value)}
                placeholder="e.g. React, Node.js"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Minimum Experience (years)
              </label>
              <input
                type="number"
                value={experienceFilter}
                onChange={(e) => setExperienceFilter(e.target.value)}
                placeholder="e.g. 3"
                min="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Candidates List */}
        {isLoading ? (
          <div className="text-center py-12">Loading candidates...</div>
        ) : candidates && candidates.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-6">
            {candidates.map((candidate) => (
              <div key={candidate._id} className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{candidate.name}</h3>
                    {candidate.title && (
                      <p className="text-indigo-600 mt-1">{candidate.title}</p>
                    )}
                    {candidate.location && (
                      <p className="text-gray-500 text-sm mt-1">📍 {candidate.location}</p>
                    )}
                  </div>
                  {candidate.experienceYears && (
                    <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">
                      {candidate.experienceYears}+ years
                    </span>
                  )}
                </div>

                {candidate.bio && (
                  <p className="text-gray-700 text-sm mb-4 line-clamp-3">{candidate.bio}</p>
                )}

                {candidate.skills && candidate.skills.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Skills:</p>
                    <div className="flex flex-wrap gap-2">
                      {candidate.skills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  {candidate.resumeUrl && (
                    <a
                      href={candidate.resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 px-4 py-2 bg-indigo-600 text-white text-center rounded-lg hover:bg-indigo-700 text-sm"
                    >
                      View Resume
                    </a>
                  )}
                  {candidate.portfolioLinks && candidate.portfolioLinks.length > 0 && (
                    <a
                      href={candidate.portfolioLinks[0]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 text-center rounded-lg hover:bg-gray-300 text-sm"
                    >
                      Portfolio
                    </a>
                  )}
                  <a
                    href={`mailto:${candidate.email}`}
                    className="flex-1 px-4 py-2 bg-green-600 text-white text-center rounded-lg hover:bg-green-700 text-sm"
                  >
                    Contact
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <p>No candidates found matching your criteria.</p>
            <p className="text-sm mt-2">Try adjusting your search filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
