import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from 'react-query';
import api from '../api/axios';

export default function PostJob() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    requiredSkills: '',
    employmentType: 'Full-time',
    minExperience: '',
    salaryMin: '',
    salaryMax: ''
  });

  const postJobMutation = useMutation(
    async (jobData) => {
      await api.post('/jobs', jobData);
    },
    {
      onSuccess: () => {
        alert('Job posted successfully!');
        navigate('/dashboard/recruiter');
      },
      onError: (err) => {
        alert(err.response?.data?.msg || 'Failed to post job');
      }
    }
  );

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const jobData = {
      title: formData.title,
      description: formData.description,
      location: formData.location,
      requiredSkills: formData.requiredSkills.split(',').map(s => s.trim()).filter(Boolean),
      employmentType: formData.employmentType,
      minExperience: formData.minExperience ? parseInt(formData.minExperience) : undefined,
      salaryRange: formData.salaryMin && formData.salaryMax ? {
        min: parseInt(formData.salaryMin),
        max: parseInt(formData.salaryMax)
      } : undefined
    };

    postJobMutation.mutate(jobData);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link to="/" className="text-2xl font-bold text-indigo-600">JobPortal</Link>
            <Link to="/dashboard/recruiter" className="px-4 py-2 text-indigo-600 hover:text-indigo-800">
              Back to Dashboard
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Post a New Job</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Title *
              </label>
              <input
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Description *
              </label>
              <textarea
                name="description"
                required
                value={formData.description}
                onChange={handleChange}
                rows="6"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location *
              </label>
              <input
                type="text"
                name="location"
                required
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. New York, NY"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Required Skills * (comma separated)
              </label>
              <input
                type="text"
                name="requiredSkills"
                required
                value={formData.requiredSkills}
                onChange={handleChange}
                placeholder="e.g. React, Node.js, MongoDB"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Employment Type *
              </label>
              <select
                name="employmentType"
                value={formData.employmentType}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Minimum Experience (years)
              </label>
              <input
                type="number"
                name="minExperience"
                value={formData.minExperience}
                onChange={handleChange}
                min="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Salary Min (in thousands)
                </label>
                <input
                  type="number"
                  name="salaryMin"
                  value={formData.salaryMin}
                  onChange={handleChange}
                  min="0"
                  placeholder="e.g. 50"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Salary Max (in thousands)
                </label>
                <input
                  type="number"
                  name="salaryMax"
                  value={formData.salaryMax}
                  onChange={handleChange}
                  min="0"
                  placeholder="e.g. 80"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={postJobMutation.isLoading}
              className="w-full py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50"
            >
              {postJobMutation.isLoading ? 'Posting...' : 'Post Job'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}