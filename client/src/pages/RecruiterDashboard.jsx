import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function RecruiterDashboard() {
  const { user, logout } = useAuth();
  const queryClient = useQueryClient();
  const [selectedJob, setSelectedJob] = useState(null);

  const { data: analytics } = useQuery('recruiterAnalytics', async () => {
    const { data } = await api.get('/analytics/recruiter');
    return data;
  });

  const { data: jobs } = useQuery('recruiterJobs', async () => {
    const { data } = await api.get('/jobs');
    return data;
  });

  const { data: applicants } = useQuery(
    ['jobApplicants', selectedJob],
    async () => {
      if (!selectedJob) return null;
      const { data } = await api.get(`/jobs/${selectedJob}/applicants`);
      return data;
    },
    { enabled: !!selectedJob }
  );

  const updateStatusMutation = useMutation(
    async ({ applicationId, status }) => {
      await api.patch(`/applications/${applicationId}/status`, { status });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['jobApplicants', selectedJob]);
        queryClient.invalidateQueries('recruiterAnalytics');
      }
    }
  );

  const statusColors = {
    applied: 'bg-blue-100 text-blue-800',
    viewed: 'bg-yellow-100 text-yellow-800',
    shortlisted: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    hired: 'bg-purple-100 text-purple-800'
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link to="/" className="text-2xl font-bold text-indigo-600">JobPortal</Link>
            <div className="flex gap-4 items-center">
              <Link
                to="/candidates"
                className="px-4 py-2 text-indigo-600 hover:text-indigo-800"
              >
                Search Candidates
              </Link>
              <Link
                to="/post-job"
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Post New Job
              </Link>
              <button
                onClick={logout}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome, {user?.name}!</h1>
        <p className="text-gray-600 mb-8">Manage your job postings and applications</p>

        {/* Analytics Cards */}
        {analytics && (
          <div className="grid md:grid-cols-5 gap-4 mb-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <p className="text-gray-600 text-sm">Total Jobs</p>
              <p className="text-3xl font-bold text-indigo-600">{analytics.totalJobs}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <p className="text-gray-600 text-sm">Active Jobs</p>
              <p className="text-3xl font-bold text-green-600">{analytics.activeJobs}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <p className="text-gray-600 text-sm">Total Applications</p>
              <p className="text-3xl font-bold text-blue-600">{analytics.totalApplications}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <p className="text-gray-600 text-sm">Shortlisted</p>
              <p className="text-3xl font-bold text-yellow-600">
                {analytics.applicationsByStatus.shortlisted}
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <p className="text-gray-600 text-sm">Hired</p>
              <p className="text-3xl font-bold text-purple-600">{analytics.applicationsByStatus.hired}</p>
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-8">
          {/* Jobs List */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold">My Job Postings</h2>
            </div>
            <div className="p-6 max-h-[600px] overflow-y-auto">
              {jobs && jobs.length > 0 ? (
                <div className="space-y-3">
                  {jobs.map((job) => (
                    <div
                      key={job._id}
                      onClick={() => setSelectedJob(job._id)}
                      className={`border rounded-lg p-4 cursor-pointer transition ${
                        selectedJob === job._id
                          ? 'border-indigo-500 bg-indigo-50'
                          : 'border-gray-200 hover:border-indigo-300'
                      }`}
                    >
                      <h3 className="font-semibold text-gray-900">{job.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{job.location}</p>
                      <div className="flex gap-2 mt-2">
                        <span className="text-xs px-2 py-1 bg-gray-100 rounded">
                          {job.employmentType}
                        </span>
                        {job.isActive ? (
                          <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded">
                            Active
                          </span>
                        ) : (
                          <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">
                            Inactive
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <p className="mb-4">You haven't posted any jobs yet.</p>
                  <Link
                    to="/post-job"
                    className="inline-block px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                  >
                    Post Your First Job
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Applicants List */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold">Applicants</h2>
            </div>
            <div className="p-6 max-h-[600px] overflow-y-auto">
              {!selectedJob ? (
                <div className="text-center py-12 text-gray-500">
                  Select a job to view applicants
                </div>
              ) : applicants && applicants.length > 0 ? (
                <div className="space-y-4">
                  {applicants.map((app) => (
                    <div key={app._id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold text-gray-900">{app.candidate.name}</h3>
                          <p className="text-sm text-gray-600">{app.candidate.email}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            Applied: {new Date(app.appliedAt).toLocaleDateString()}
                          </p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[app.status]}`}>
                          {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                        </span>
                      </div>

                      {app.candidate.skills && app.candidate.skills.length > 0 && (
                        <div className="mb-3">
                          <p className="text-xs text-gray-600 mb-1">Skills:</p>
                          <div className="flex flex-wrap gap-1">
                            {app.candidate.skills.map((skill, idx) => (
                              <span key={idx} className="text-xs px-2 py-1 bg-indigo-50 text-indigo-700 rounded">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {app.coverLetter && (
                        <div className="mb-3 p-2 bg-gray-50 rounded text-sm text-gray-700">
                          <p className="font-medium text-xs text-gray-600 mb-1">Cover Letter:</p>
                          {app.coverLetter}
                        </div>
                      )}

                      <div className="flex gap-2">
                        <select
                          value={app.status}
                          onChange={(e) =>
                            updateStatusMutation.mutate({
                              applicationId: app._id,
                              status: e.target.value
                            })
                          }
                          className="flex-1 text-sm px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                          <option value="applied">Applied</option>
                          <option value="viewed">Viewed</option>
                          <option value="shortlisted">Shortlisted</option>
                          <option value="rejected">Rejected</option>
                          <option value="hired">Hired</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  No applicants for this job yet
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}