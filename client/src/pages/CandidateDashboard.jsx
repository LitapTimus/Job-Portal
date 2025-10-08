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
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link to="/" className="text-2xl font-bold text-indigo-600">JobPortal</Link>
            <div className="flex gap-4 items-center">
              <Link to="/profile" className="px-4 py-2 text-indigo-600 hover:text-indigo-800">
                My Profile
              </Link>
              <Link to="/jobs" className="px-4 py-2 text-indigo-600 hover:text-indigo-800">
                Browse Jobs
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
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome, {user?.name}!</h1>
            <p className="text-gray-600">Track your job applications and progress</p>
          </div>
          {!user?.skills || user.skills.length === 0 ? (
            <Link
              to="/profile"
              className="px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 font-semibold"
            >
              Complete Your Profile
            </Link>
          ) : null}
        </div>

        {/* Analytics Cards */}
        {analytics && (
          <>
            <div className="grid md:grid-cols-5 gap-4 mb-8">
              <div className="bg-white p-6 rounded-lg shadow">
                <p className="text-gray-600 text-sm">Total Applications</p>
                <p className="text-3xl font-bold text-indigo-600">{analytics.totalApplications}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <p className="text-gray-600 text-sm">Applied</p>
                <p className="text-3xl font-bold text-blue-600">{analytics.applicationsByStatus.applied}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <p className="text-gray-600 text-sm">Shortlisted</p>
                <p className="text-3xl font-bold text-green-600">{analytics.applicationsByStatus.shortlisted}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <p className="text-gray-600 text-sm">Rejected</p>
                <p className="text-3xl font-bold text-red-600">{analytics.applicationsByStatus.rejected}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <p className="text-gray-600 text-sm">Hired</p>
                <p className="text-3xl font-bold text-purple-600">{analytics.applicationsByStatus.hired}</p>
              </div>
            </div>

            {/* Success Rate */}
            {analytics.totalApplications > 0 && (
              <div className="bg-white p-6 rounded-lg shadow mb-8">
                <h3 className="text-lg font-semibold mb-4">Application Success Rate</h3>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="flex justify-between text-sm mb-2">
                      <span>Success Rate</span>
                      <span className="font-semibold">
                        {Math.round(((analytics.applicationsByStatus.shortlisted + analytics.applicationsByStatus.hired) / analytics.totalApplications) * 100)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-4">
                      <div
                        className="bg-green-500 h-4 rounded-full"
                        style={{
                          width: `${((analytics.applicationsByStatus.shortlisted + analytics.applicationsByStatus.hired) / analytics.totalApplications) * 100}%`
                        }}
                      />
                    </div>
                  </div>
                  <div className="text-center px-6 border-l">
                    <p className="text-2xl font-bold text-green-600">
                      {analytics.applicationsByStatus.shortlisted + analytics.applicationsByStatus.hired}
                    </p>
                    <p className="text-sm text-gray-600">Positive Responses</p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* Applications List */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold">My Applications</h2>
          </div>
          <div className="p-6">
            {applications && applications.length > 0 ? (
              <div className="space-y-4">
                {applications.map((app) => (
                  <div key={app._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <Link
                          to={`/jobs/${app.job._id}`}
                          className="text-lg font-semibold text-indigo-600 hover:text-indigo-800"
                        >
                          {app.job.title}
                        </Link>
                        <p className="text-gray-600 mt-1">{app.job.location}</p>
                        <p className="text-sm text-gray-500 mt-2">
                          Applied on {new Date(app.appliedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[app.status]}`}>
                          {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                        </span>
                      </div>
                    </div>
                    {app.coverLetter && (
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Cover Letter:</span> {app.coverLetter}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <p className="mb-4">You haven't applied to any jobs yet.</p>
                <Link
                  to="/jobs"
                  className="inline-block px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
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