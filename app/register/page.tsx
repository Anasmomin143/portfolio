'use client';

import { useState } from 'react';
import { getTenantUrl } from '@/lib/utils/subdomain';
import Link from 'next/link';

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [checkingSubdomain, setCheckingSubdomain] = useState(false);
  const [subdomainAvailable, setSubdomainAvailable] = useState<boolean | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    subdomain: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Check subdomain availability with debounce
  const checkSubdomain = async (subdomain: string) => {
    if (!subdomain || subdomain.length < 3) {
      setSubdomainAvailable(null);
      return;
    }

    setCheckingSubdomain(true);

    try {
      const res = await fetch(`/api/register?subdomain=${subdomain}`);

      // Check if response is JSON
      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await res.text();
        console.error('Non-JSON response:', text.substring(0, 200));
        throw new Error('API route error. Please ensure database migration is complete.');
      }

      const data = await res.json();

      setSubdomainAvailable(data.available);
      if (!data.available) {
        setErrors((prev) => ({ ...prev, subdomain: data.error || 'Subdomain not available' }));
      } else {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.subdomain;
          return newErrors;
        });
      }
    } catch (error) {
      console.error('Error checking subdomain:', error);
      setErrors((prev) => ({
        ...prev,
        subdomain: error instanceof Error ? error.message : 'Failed to check subdomain'
      }));
    } finally {
      setCheckingSubdomain(false);
    }
  };

  const handleSubdomainChange = (value: string) => {
    const normalized = value.toLowerCase().replace(/[^a-z0-9-]/g, '');
    setFormData({ ...formData, subdomain: normalized });
    setSubdomainAvailable(null);

    // Debounced check
    const timer = setTimeout(() => {
      checkSubdomain(normalized);
    }, 500);

    return () => clearTimeout(timer);
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.subdomain.trim()) {
      newErrors.subdomain = 'Subdomain is required';
    } else if (formData.subdomain.length < 3) {
      newErrors.subdomain = 'Subdomain must be at least 3 characters';
    } else if (subdomainAvailable === false) {
      newErrors.subdomain = 'Subdomain not available';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          subdomain: formData.subdomain,
        }),
      });

      // Check if response is JSON
      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await res.text();
        console.error('Non-JSON response from registration:', text.substring(0, 200));
        throw new Error('API error. Please ensure the database migration has been run.');
      }

      const data = await res.json();

      if (!res.ok) {
        setErrors({ form: data.error || 'Registration failed' });
        setLoading(false);
        return;
      }

      // Success! Redirect to tenant subdomain login
      const tenantUrl = getTenantUrl(data.tenant.subdomain, '/admin/login');
      window.location.href = tenantUrl;
    } catch (error) {
      console.error('Registration error:', error);
      setErrors({ form: error instanceof Error ? error.message : 'An unexpected error occurred. Please try again.' });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--background)' }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--foreground)' }}>
            Create Your Portfolio
          </h1>
          <p style={{ color: 'var(--muted-foreground)' }}>
            Get started with your professional portfolio in minutes
          </p>
        </div>

        <div
          className="p-8 rounded-lg border"
          style={{
            background: 'var(--card)',
            borderColor: 'var(--card-border)',
          }}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>
                Full Name
              </label>
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border"
                style={{
                  background: 'var(--background)',
                  borderColor: errors.name ? '#ef4444' : 'var(--card-border)',
                  color: 'var(--foreground)',
                }}
                placeholder="John Doe"
              />
              {errors.name && <p className="text-sm mt-1" style={{ color: '#ef4444' }}>{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>
                Email
              </label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border"
                style={{
                  background: 'var(--background)',
                  borderColor: errors.email ? '#ef4444' : 'var(--card-border)',
                  color: 'var(--foreground)',
                }}
                placeholder="john@example.com"
              />
              {errors.email && <p className="text-sm mt-1" style={{ color: '#ef4444' }}>{errors.email}</p>}
            </div>

            {/* Subdomain */}
            <div>
              <label htmlFor="subdomain" className="block text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>
                Choose Your Subdomain
              </label>
              <div className="flex items-center gap-2">
                <input
                  id="subdomain"
                  type="text"
                  value={formData.subdomain}
                  onChange={(e) => handleSubdomainChange(e.target.value)}
                  className="flex-1 px-4 py-2 rounded-lg border"
                  style={{
                    background: 'var(--background)',
                    borderColor: errors.subdomain ? '#ef4444' : subdomainAvailable ? '#22c55e' : 'var(--card-border)',
                    color: 'var(--foreground)',
                  }}
                  placeholder="yourname"
                />
                <span style={{ color: 'var(--muted-foreground)' }}>.portfolio.com</span>
              </div>
              {checkingSubdomain && <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>Checking availability...</p>}
              {subdomainAvailable === true && <p className="text-sm mt-1" style={{ color: '#22c55e' }}>✓ Subdomain available!</p>}
              {errors.subdomain && <p className="text-sm mt-1" style={{ color: '#ef4444' }}>{errors.subdomain}</p>}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>
                Password
              </label>
              <input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border"
                style={{
                  background: 'var(--background)',
                  borderColor: errors.password ? '#ef4444' : 'var(--card-border)',
                  color: 'var(--foreground)',
                }}
                placeholder="••••••••"
              />
              {errors.password && <p className="text-sm mt-1" style={{ color: '#ef4444' }}>{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border"
                style={{
                  background: 'var(--background)',
                  borderColor: errors.confirmPassword ? '#ef4444' : 'var(--card-border)',
                  color: 'var(--foreground)',
                }}
                placeholder="••••••••"
              />
              {errors.confirmPassword && <p className="text-sm mt-1" style={{ color: '#ef4444' }}>{errors.confirmPassword}</p>}
            </div>

            {/* Form Error */}
            {errors.form && (
              <div className="p-4 rounded-lg border" style={{ background: '#fef2f2', borderColor: '#fecaca' }}>
                <p className="text-sm" style={{ color: '#dc2626' }}>{errors.form}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || checkingSubdomain}
              className="w-full px-6 py-3 rounded-lg font-medium transition-opacity disabled:opacity-50"
              style={{ background: 'var(--color-primary)', color: 'white' }}
            >
              {loading ? 'Creating Account...' : 'Create Portfolio'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
              Already have an account?{' '}
              <Link href="/login" className="font-medium hover:underline" style={{ color: 'var(--color-primary)' }}>
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
