'use client';

import { useEffect, useState } from 'react';
import { COMMON_INLINE_STYLES, THEME_GRADIENTS } from '@/lib/constants/styles';
import { Save, User, Mail, Phone, MapPin, Briefcase, Link as LinkIcon, FileText } from 'lucide-react';
import { useAppDispatch } from '@/lib/redux/hooks';
import { addToast, setGlobalLoading } from '@/lib/redux/slices/uiSlice';
import { PersonalInfo } from '@/types/resume';

export default function PersonalDetailsPage() {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<Partial<PersonalInfo>>({
    full_name: '',
    title: '',
    email: '',
    phone: '',
    location: '',
    bio: '',
    summary: '',
    linkedin_url: '',
    github_url: '',
    twitter_url: '',
    portfolio_url: '',
    website_url: '',
    profile_photo_url: '',
    resume_url: '',
  });

  useEffect(() => {
    fetchPersonalDetails();
  }, []);

  const fetchPersonalDetails = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/personal-details');
      if (res.ok) {
        const data = await res.json();
        if (data) {
          setFormData(data);
        }
      }
    } catch (error) {
      console.error('Error fetching personal details:', error);
      dispatch(addToast({
        type: 'error',
        message: 'Failed to load personal details',
      }));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setSaving(true);
      dispatch(setGlobalLoading(true));

      const res = await fetch('/api/admin/personal-details', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error('Failed to save personal details');
      }

      const data = await res.json();
      setFormData(data);

      dispatch(addToast({
        type: 'success',
        message: 'Personal details saved successfully',
      }));
    } catch (error) {
      console.error('Error saving personal details:', error);
      dispatch(addToast({
        type: 'error',
        message: 'Failed to save personal details',
      }));
    } finally {
      setSaving(false);
      dispatch(setGlobalLoading(false));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
          <p className="text-sm" style={COMMON_INLINE_STYLES.textMuted}>
            Loading personal details...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div
          className="rounded-xl p-6"
          style={{ background: THEME_GRADIENTS.card, border: '1px solid var(--card-border)' }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div
              className="p-2 rounded-lg"
              style={{ background: THEME_GRADIENTS.secondary }}
            >
              <User className="w-5 h-5" style={{ color: 'var(--color-primary)' }} />
            </div>
            <h2 className="text-xl font-bold" style={COMMON_INLINE_STYLES.text}>
              Basic Information
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2" style={COMMON_INLINE_STYLES.text}>
                Full Name *
              </label>
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-500"
                style={{ background: 'var(--color-background)', borderColor: 'var(--card-border)', color: 'var(--color-text)' }}
                placeholder="Your full name"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2" style={COMMON_INLINE_STYLES.text}>
                Professional Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-500"
                style={{ background: 'var(--color-background)', borderColor: 'var(--card-border)', color: 'var(--color-text)' }}
                placeholder="e.g., Full Stack Developer, Software Engineer"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={COMMON_INLINE_STYLES.text}>
                <Mail className="w-4 h-4 inline mr-1" />
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-500"
                style={{ background: 'var(--color-background)', borderColor: 'var(--card-border)', color: 'var(--color-text)' }}
                placeholder="your.email@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={COMMON_INLINE_STYLES.text}>
                <Phone className="w-4 h-4 inline mr-1" />
                Phone *
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-500"
                style={{ background: 'var(--color-background)', borderColor: 'var(--card-border)', color: 'var(--color-text)' }}
                placeholder="+1 (555) 123-4567"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2" style={COMMON_INLINE_STYLES.text}>
                <MapPin className="w-4 h-4 inline mr-1" />
                Location *
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-500"
                style={{ background: 'var(--color-background)', borderColor: 'var(--card-border)', color: 'var(--color-text)' }}
                placeholder="e.g., San Francisco, CA"
              />
            </div>
          </div>
        </div>

        {/* About */}
        <div
          className="rounded-xl p-6"
          style={{ background: THEME_GRADIENTS.card, border: '1px solid var(--card-border)' }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div
              className="p-2 rounded-lg"
              style={{ background: THEME_GRADIENTS.secondary }}
            >
              <FileText className="w-5 h-5" style={{ color: 'var(--color-primary)' }} />
            </div>
            <h2 className="text-xl font-bold" style={COMMON_INLINE_STYLES.text}>
              About
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2" style={COMMON_INLINE_STYLES.text}>
                Professional Summary
              </label>
              <textarea
                name="summary"
                value={formData.summary}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-500"
                style={{ background: 'var(--color-background)', borderColor: 'var(--card-border)', color: 'var(--color-text)' }}
                placeholder="A brief professional summary (2-3 sentences)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={COMMON_INLINE_STYLES.text}>
                Bio
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={6}
                className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-500"
                style={{ background: 'var(--color-background)', borderColor: 'var(--card-border)', color: 'var(--color-text)' }}
                placeholder="A longer biography or about section"
              />
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div
          className="rounded-xl p-6"
          style={{ background: THEME_GRADIENTS.card, border: '1px solid var(--card-border)' }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div
              className="p-2 rounded-lg"
              style={{ background: THEME_GRADIENTS.secondary }}
            >
              <LinkIcon className="w-5 h-5" style={{ color: 'var(--color-primary)' }} />
            </div>
            <h2 className="text-xl font-bold" style={COMMON_INLINE_STYLES.text}>
              Social Links & URLs
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2" style={COMMON_INLINE_STYLES.text}>
                LinkedIn URL
              </label>
              <input
                type="url"
                name="linkedin_url"
                value={formData.linkedin_url}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-500"
                style={{ background: 'var(--color-background)', borderColor: 'var(--card-border)', color: 'var(--color-text)' }}
                placeholder="https://linkedin.com/in/yourprofile"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={COMMON_INLINE_STYLES.text}>
                GitHub URL
              </label>
              <input
                type="url"
                name="github_url"
                value={formData.github_url}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-500"
                style={{ background: 'var(--color-background)', borderColor: 'var(--card-border)', color: 'var(--color-text)' }}
                placeholder="https://github.com/yourusername"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={COMMON_INLINE_STYLES.text}>
                Twitter URL
              </label>
              <input
                type="url"
                name="twitter_url"
                value={formData.twitter_url}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-500"
                style={{ background: 'var(--color-background)', borderColor: 'var(--card-border)', color: 'var(--color-text)' }}
                placeholder="https://twitter.com/yourusername"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={COMMON_INLINE_STYLES.text}>
                Portfolio URL
              </label>
              <input
                type="url"
                name="portfolio_url"
                value={formData.portfolio_url}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-500"
                style={{ background: 'var(--color-background)', borderColor: 'var(--card-border)', color: 'var(--color-text)' }}
                placeholder="https://yourportfolio.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={COMMON_INLINE_STYLES.text}>
                Website URL
              </label>
              <input
                type="url"
                name="website_url"
                value={formData.website_url}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-500"
                style={{ background: 'var(--color-background)', borderColor: 'var(--card-border)', color: 'var(--color-text)' }}
                placeholder="https://yourwebsite.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={COMMON_INLINE_STYLES.text}>
                Profile Photo URL
              </label>
              <input
                type="url"
                name="profile_photo_url"
                value={formData.profile_photo_url}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-500"
                style={{ background: 'var(--color-background)', borderColor: 'var(--card-border)', color: 'var(--color-text)' }}
                placeholder="https://example.com/photo.jpg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={COMMON_INLINE_STYLES.text}>
                Resume URL
              </label>
              <input
                type="url"
                name="resume_url"
                value={formData.resume_url}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-500"
                style={{ background: 'var(--color-background)', borderColor: 'var(--card-border)', color: 'var(--color-text)' }}
                placeholder="https://example.com/resume.pdf"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium text-white transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ background: THEME_GRADIENTS.primary, boxShadow: '0 4px 12px rgba(168, 85, 247, 0.3)' }}
          >
            <Save className="w-5 h-5" />
            {saving ? 'Saving...' : 'Save Personal Details'}
          </button>
        </div>
      </form>
    </div>
  );
}
