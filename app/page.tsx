'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ArrowRight, LogIn, UserPlus } from 'lucide-react';

export default function LandingPage() {
  const [subdomain, setSubdomain] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleExistingUserLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!subdomain.trim()) {
      setError('Please enter your subdomain');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Check if subdomain exists
      const response = await fetch(`/api/check-subdomain?subdomain=${subdomain.trim().toLowerCase()}`);
      const data = await response.json();

      if (response.ok && data.exists) {
        // Redirect to subdomain admin login
        const protocol = window.location.protocol;
        const mainDomain = process.env.NEXT_PUBLIC_MAIN_DOMAIN || 'localhost:3000';
        window.location.href = `${protocol}//${subdomain.trim().toLowerCase()}.${mainDomain}/admin/login`;
      } else {
        setError('Subdomain not found. Please check your subdomain or register a new account.');
      }
    } catch (err) {
      console.error('Error checking subdomain:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <div className="max-w-4xl w-full text-center">
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Multi-Tenant Portfolio Platform
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8">
            Create your professional portfolio with your own subdomain
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              href="/register"
              className="group px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold text-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
            >
              <UserPlus className="w-5 h-5" />
              Create Your Portfolio
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href="#how-it-works"
              className="px-8 py-4 border-2 border-purple-600 text-purple-600 rounded-lg font-semibold text-lg hover:bg-purple-50 transition-colors"
            >
              Learn More
            </a>
          </div>

          {/* Existing User Login Section */}
          <div className="mt-12 p-6 md:p-8 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border-2 border-gray-200">
            <h3 className="font-bold text-xl mb-2 text-gray-800 flex items-center justify-center gap-2">
              <LogIn className="w-5 h-5" />
              Already have an account?
            </h3>
            <p className="text-gray-600 mb-6">
              Enter your subdomain to access your portfolio admin panel
            </p>

            <form onSubmit={handleExistingUserLogin} className="max-w-md mx-auto">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={subdomain}
                    onChange={(e) => {
                      setSubdomain(e.target.value);
                      setError('');
                    }}
                    placeholder="yourname"
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-purple-500 focus:outline-none transition-colors text-gray-800"
                    disabled={loading}
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                    .{process.env.NEXT_PUBLIC_MAIN_DOMAIN || 'localhost:3000'}
                  </span>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-all duration-300 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Checking...
                    </>
                  ) : (
                    <>
                      Go to Login
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
              {error && (
                <p className="mt-3 text-sm text-red-600 bg-red-50 px-4 py-2 rounded-lg">
                  {error}
                </p>
              )}
            </form>

            <p className="text-xs text-gray-500 mt-4">
              Your portfolio will be at: <code className="bg-white px-2 py-1 rounded border">yourname.localhost:3000</code>
            </p>
          </div>

          {/* How it works section */}
          <div id="how-it-works" className="grid md:grid-cols-3 gap-6 md:gap-8 text-left mt-16">
            <div className="p-6 bg-purple-50 rounded-lg hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">🚀</div>
              <h3 className="text-xl font-bold mb-2">1. Register</h3>
              <p className="text-gray-600">
                Choose your subdomain and create your account in seconds
              </p>
            </div>

            <div className="p-6 bg-blue-50 rounded-lg hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">✏️</div>
              <h3 className="text-xl font-bold mb-2">2. Customize</h3>
              <p className="text-gray-600">
                Add your projects, experience, skills, and certifications
              </p>
            </div>

            <div className="p-6 bg-indigo-50 rounded-lg hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">🌐</div>
              <h3 className="text-xl font-bold mb-2">3. Share</h3>
              <p className="text-gray-600">
                Your portfolio lives at yourname.domain.com
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
