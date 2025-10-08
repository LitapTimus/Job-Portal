import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const RoleSelection = () => {
  const [selectedRole, setSelectedRole] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { oauthLogin } = useAuth();

  const token = searchParams.get('token');
  const userParam = searchParams.get('user');

  useEffect(() => {
    if (!token || !userParam) {
      navigate('/login');
    }
  }, [token, userParam, navigate]);

  const handleRoleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedRole) return;

    setLoading(true);
    try {
      // Set the token in api headers
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      const response = await api.post('/auth/update-role', {
        role: selectedRole
      });

      // Login the user with updated role
      const userData = response.data.user;
      oauthLogin(token, userData);

      // Redirect based on role
      if (selectedRole === 'recruiter') {
        navigate('/dashboard/recruiter');
      } else {
        navigate('/dashboard/candidate');
      }
    } catch (error) {
      console.error('Error updating role:', error);
      alert('Failed to update role. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Complete Your Profile
          </h1>
          <p className="text-gray-600">
            Please select your role to continue
          </p>
        </div>

        <form onSubmit={handleRoleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div
              className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                selectedRole === 'candidate'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setSelectedRole('candidate')}
            >
              <div className="flex items-center">
                <input
                  type="radio"
                  id="candidate"
                  name="role"
                  value="candidate"
                  checked={selectedRole === 'candidate'}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="mr-3"
                />
                <div>
                  <label htmlFor="candidate" className="font-semibold text-gray-900 cursor-pointer">
                    Job Seeker
                  </label>
                  <p className="text-sm text-gray-600">
                    Looking for job opportunities
                  </p>
                </div>
              </div>
            </div>

            <div
              className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                selectedRole === 'recruiter'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setSelectedRole('recruiter')}
            >
              <div className="flex items-center">
                <input
                  type="radio"
                  id="recruiter"
                  name="role"
                  value="recruiter"
                  checked={selectedRole === 'recruiter'}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="mr-3"
                />
                <div>
                  <label htmlFor="recruiter" className="font-semibold text-gray-900 cursor-pointer">
                    Recruiter
                  </label>
                  <p className="text-sm text-gray-600">
                    Hiring talented candidates
                  </p>
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={!selectedRole || loading}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Setting up your account...' : 'Continue'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RoleSelection;
