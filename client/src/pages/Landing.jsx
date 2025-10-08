import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Landing() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              JobPortal
            </div>
            <div className="flex gap-4">
              {user ? (
                <>
                  <Link
                    to={user.role === 'candidate' ? '/dashboard/candidate' : '/dashboard/recruiter'}
                    className="px-4 py-2 text-indigo-600 hover:text-indigo-800"
                  >
                    Dashboard
                  </Link>
                  <Link to="/jobs" className="px-4 py-2 text-indigo-600 hover:text-indigo-800">
                    Browse Jobs
                  </Link>
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

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center animate-fadeIn">
          <div className="inline-block mb-4">
            <span className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm font-semibold">
              🚀 Your Career Journey Starts Here
            </span>
          </div>
          <h1 className="text-6xl font-extrabold text-gray-900 mb-6 leading-tight">
            Find Your Dream Job
            <span className="block bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Today
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
            Connect with top employers and discover opportunities that match your skills and aspirations. 
            Join thousands of professionals advancing their careers.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <button
              onClick={() => navigate('/jobs')}
              className="group px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl text-lg font-semibold hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center gap-2"
            >
              Browse Jobs
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
            {!user && (
              <button
                onClick={() => navigate('/signup')}
                className="px-8 py-4 bg-white text-indigo-600 rounded-xl text-lg font-semibold border-2 border-indigo-600 hover:bg-indigo-50 hover:shadow-lg transition-all duration-300"
              >
                Get Started Free
              </button>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 animate-fadeIn">
          <div className="text-center">
            <div className="text-4xl font-bold text-indigo-600">1000+</div>
            <div className="text-gray-600 mt-1">Active Jobs</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-purple-600">500+</div>
            <div className="text-gray-600 mt-1">Companies</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-pink-600">5000+</div>
            <div className="text-gray-600 mt-1">Candidates</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600">95%</div>
            <div className="text-gray-600 mt-1">Success Rate</div>
          </div>
        </div>

        {/* Features */}
        <div className="mt-24 grid md:grid-cols-3 gap-8">
          <div className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
            <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">
              🎯
            </div>
            <h3 className="text-2xl font-bold mb-3 text-gray-900">Smart Matching</h3>
            <p className="text-gray-600 leading-relaxed">
              Our AI-powered algorithm finds jobs that perfectly match your skills, experience, and career goals.
            </p>
          </div>
          <div className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">
              💼
            </div>
            <h3 className="text-2xl font-bold mb-3 text-gray-900">Top Companies</h3>
            <p className="text-gray-600 leading-relaxed">
              Connect with leading employers across various industries and find your perfect workplace.
            </p>
          </div>
          <div className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
            <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">
              📈
            </div>
            <h3 className="text-2xl font-bold mb-3 text-gray-900">Career Growth</h3>
            <p className="text-gray-600 leading-relaxed">
              Track your applications, get insights, and advance your career with our comprehensive tools.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-24 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-12 text-center text-white shadow-2xl">
          <h2 className="text-4xl font-bold mb-4">Ready to Take the Next Step?</h2>
          <p className="text-xl mb-8 opacity-90">Join our community and start your journey today</p>
          <button
            onClick={() => navigate('/signup')}
            className="px-10 py-4 bg-white text-indigo-600 rounded-xl text-lg font-bold hover:shadow-2xl hover:scale-105 transition-all duration-300"
          >
            Create Your Account
          </button>
        </div>
      </div>
    </div>
  );
}