import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from 'react-query';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function JobDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [coverLetter, setCoverLetter] = useState('');
  const [showApplyForm, setShowApplyForm] = useState(false);

  const { data: job, isLoading } = useQuery(['job', id], async () => {
    const { data } = await api.get(`/jobs/${id}`);
    return data;
  });

  const applyMutation = useMutation(
    async () => {
      await api.post('/applications', { jobId: id, coverLetter });
    },
    {
      onSuccess: () => {
        alert('Application submitted successfully!');
        setShowApplyForm(false);
        setCoverLetter('');
      },
      onError: (err) => {
        alert(err.response?.data?.msg || 'Failed to apply');
      }
    }
  );

  const handleApply = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (user.role !== 'candidate') {
      alert('Only candidates can apply for jobs');
      return;
    }
    setShowApplyForm(true);
  };

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!job) {
    return <div className="flex items-center justify-center min-h-screen">Job not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link to="/" className="text-2xl font-bold text-indigo-600">JobPortal</Link>
            <Link to="/jobs" className="px-4 py-2 text-indigo-600 hover:text-indigo-800">
              Back to Jobs
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{job.title}</h1>
          
          <div className="flex gap-4 text-gray-600 mb-6">
            <span>{job.recruiter?.companyName || job.recruiter?.name}</span>
            <span>•</span>
            <span>{job.location}</span>
            <span>•</span>
            <span>{job.employmentType}</span>
          </div>

          {job.salaryRange && (
            <p className="text-lg text-gray-700 mb-6">
              Salary: ${job.salaryRange.min}k - ${job.salaryRange.max}k
            </p>
          )}

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-3">Job Description</h2>
            <p className="text-gray-700 whitespace-pre-line">{job.description}</p>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-3">Required Skills</h2>
            <div className="flex flex-wrap gap-2">
              {job.requiredSkills?.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {job.minExperience && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-3">Experience Required</h2>
              <p className="text-gray-700">{job.minExperience}+ years</p>
            </div>
          )}

          {!showApplyForm ? (
            <button
              onClick={handleApply}
              className="w-full py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700"
            >
              Apply Now
            </button>
          ) : (
            <div className="mt-6 border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">Submit Your Application</h3>
              <textarea
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                placeholder="Write a cover letter (optional)"
                rows="6"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <div className="flex gap-4 mt-4">
                <button
                  onClick={() => applyMutation.mutate()}
                  disabled={applyMutation.isLoading}
                  className="flex-1 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50"
                >
                  {applyMutation.isLoading ? 'Submitting...' : 'Submit Application'}
                </button>
                <button
                  onClick={() => setShowApplyForm(false)}
                  className="flex-1 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}