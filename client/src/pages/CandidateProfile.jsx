import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from 'react-query';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function CandidateProfile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    bio: '',
    location: '',
    skills: '',
    experienceYears: '',
    portfolioLinks: ''
  });
  const [resumeFile, setResumeFile] = useState(null);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        title: user.title || '',
        bio: user.bio || '',
        location: user.location || '',
        skills: user.skills?.join(', ') || '',
        experienceYears: user.experienceYears || '',
        portfolioLinks: user.portfolioLinks?.join(', ') || ''
      });
    }
  }, [user]);

  const updateProfileMutation = useMutation(
    async (data) => {
      await api.put('/users/me', data);
    },
    {
      onSuccess: () => {
        alert('Profile updated successfully!');
        navigate('/dashboard/candidate');
      },
      onError: (err) => {
        alert(err.response?.data?.msg || 'Failed to update profile');
      }
    }
  );

  const uploadResumeMutation = useMutation(
    async (file) => {
      const formData = new FormData();
      formData.append('resume', file);
      await api.post('/users/upload-resume', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    },
    {
      onSuccess: () => {
        alert('Resume uploaded successfully!');
      },
      onError: (err) => {
        alert(err.response?.data?.msg || 'Failed to upload resume');
      }
    }
  );

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const profileData = {
      name: formData.name,
      title: formData.title,
      bio: formData.bio,
      location: formData.location,
      skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean),
      experienceYears: formData.experienceYears ? parseInt(formData.experienceYears) : undefined,
      portfolioLinks: formData.portfolioLinks.split(',').map(s => s.trim()).filter(Boolean)
    };

    updateProfileMutation.mutate(profileData);
  };

  const handleResumeUpload = () => {
    if (resumeFile) {
      uploadResumeMutation.mutate(resumeFile);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link to="/" className="text-2xl font-bold text-indigo-600">JobPortal</Link>
            <Link to="/dashboard/candidate" className="px-4 py-2 text-indigo-600 hover:text-indigo-800">
              Back to Dashboard
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Create Your Portfolio</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Professional Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Full Stack Developer"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bio / About Me
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows="4"
                placeholder="Tell us about yourself..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. New York, NY"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Skills * (comma separated)
              </label>
              <input
                type="text"
                name="skills"
                required
                value={formData.skills}
                onChange={handleChange}
                placeholder="e.g. JavaScript, React, Node.js, MongoDB"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Years of Experience
              </label>
              <input
                type="number"
                name="experienceYears"
                value={formData.experienceYears}
                onChange={handleChange}
                min="0"
                placeholder="e.g. 3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Portfolio Links (comma separated)
              </label>
              <input
                type="text"
                name="portfolioLinks"
                value={formData.portfolioLinks}
                onChange={handleChange}
                placeholder="e.g. https://github.com/username, https://portfolio.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="border-t pt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Resume
              </label>
              <div className="flex gap-4 items-center">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => setResumeFile(e.target.files[0])}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="button"
                  onClick={handleResumeUpload}
                  disabled={!resumeFile || uploadResumeMutation.isLoading}
                  className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50"
                >
                  {uploadResumeMutation.isLoading ? 'Uploading...' : 'Upload'}
                </button>
              </div>
              {user?.resumeUrl && (
                <p className="text-sm text-green-600 mt-2">
                  ✓ Resume uploaded: <a href={user.resumeUrl} target="_blank" rel="noopener noreferrer" className="underline">View</a>
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={updateProfileMutation.isLoading}
              className="w-full py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50"
            >
              {updateProfileMutation.isLoading ? 'Saving...' : 'Save Profile'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
