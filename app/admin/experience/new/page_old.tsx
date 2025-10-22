'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AdminSidebar } from '@/components/admin/admin-sidebar';
import { COMMON_INLINE_STYLES, THEME_GRADIENTS } from '@/lib/constants/styles';
import { ArrowLeft, Save, Plus, X } from 'lucide-react';

export default function NewExperiencePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    company: '',
    position: '',
    location: '',
    start_date: '',
    end_date: '',
    current: false,
    description: '',
    responsibilities: [] as string[],
    technologies: [] as string[],
    achievements: [] as string[],
    display_order: 0,
  });

  const [techInput, setTechInput] = useState('');
  const [responsibilityInput, setResponsibilityInput] = useState('');
  const [achievementInput, setAchievementInput] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/experience', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          end_date: formData.current ? null : formData.end_date || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to create experience');
      }

      router.push('/admin/experience');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setLoading(false);
    }
  };

  const addTechnology = () => {
    if (techInput.trim() && !formData.technologies.includes(techInput.trim())) {
      setFormData({ ...formData, technologies: [...formData.technologies, techInput.trim()] });
      setTechInput('');
    }
  };

  const removeTechnology = (tech: string) => {
    setFormData({ ...formData, technologies: formData.technologies.filter((t) => t !== tech) });
  };

  const addResponsibility = () => {
    if (responsibilityInput.trim() && !formData.responsibilities.includes(responsibilityInput.trim())) {
      setFormData({ ...formData, responsibilities: [...formData.responsibilities, responsibilityInput.trim()] });
      setResponsibilityInput('');
    }
  };

  const removeResponsibility = (item: string) => {
    setFormData({ ...formData, responsibilities: formData.responsibilities.filter((r) => r !== item) });
  };

  const addAchievement = () => {
    if (achievementInput.trim() && !formData.achievements.includes(achievementInput.trim())) {
      setFormData({ ...formData, achievements: [...formData.achievements, achievementInput.trim()] });
      setAchievementInput('');
    }
  };

  const removeAchievement = (item: string) => {
    setFormData({ ...formData, achievements: formData.achievements.filter((a) => a !== item) });
  };

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--color-background)' }}>
      <AdminSidebar user={{ email: '', name: 'Admin' }} />
      <div className="flex-1 lg:ml-64">
        <main className="p-6 lg:p-8">
          {/* Header */}
          <div className="mb-8">
            <Link
              href="/admin/experience"
              className="inline-flex items-center gap-2 text-sm mb-4 hover:underline"
              style={COMMON_INLINE_STYLES.textMuted}
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Experience
            </Link>
            <h1 className="text-3xl font-bold" style={COMMON_INLINE_STYLES.text}>
              Add New Experience
            </h1>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="max-w-4xl">
            <div className="rounded-xl p-6 mb-6" style={{ background: THEME_GRADIENTS.card, border: '1px solid var(--card-border)' }}>
              {/* Error Message */}
              {error && (
                <div className="mb-6 p-4 rounded-lg" style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
                  <p style={{ color: '#ef4444' }}>{error}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Company */}
                <div>
                  <label className="block text-sm font-medium mb-2" style={COMMON_INLINE_STYLES.text}>
                    Company *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="e.g., Acme Corp"
                    className="w-full px-4 py-3 rounded-lg outline-none transition-all duration-300"
                    style={{ background: 'var(--color-background)', border: '1px solid var(--card-border)', color: 'var(--color-text)' }}
                  />
                </div>

                {/* Position */}
                <div>
                  <label className="block text-sm font-medium mb-2" style={COMMON_INLINE_STYLES.text}>
                    Position *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    placeholder="e.g., Senior Software Engineer"
                    className="w-full px-4 py-3 rounded-lg outline-none transition-all duration-300"
                    style={{ background: 'var(--color-background)', border: '1px solid var(--card-border)', color: 'var(--color-text)' }}
                  />
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium mb-2" style={COMMON_INLINE_STYLES.text}>
                    Location
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g., San Francisco, CA"
                    className="w-full px-4 py-3 rounded-lg outline-none transition-all duration-300"
                    style={{ background: 'var(--color-background)', border: '1px solid var(--card-border)', color: 'var(--color-text)' }}
                  />
                </div>

                {/* Display Order */}
                <div>
                  <label className="block text-sm font-medium mb-2" style={COMMON_INLINE_STYLES.text}>
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={formData.display_order}
                    onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-3 rounded-lg outline-none transition-all duration-300"
                    style={{ background: 'var(--color-background)', border: '1px solid var(--card-border)', color: 'var(--color-text)' }}
                  />
                </div>

                {/* Start Date */}
                <div>
                  <label className="block text-sm font-medium mb-2" style={COMMON_INLINE_STYLES.text}>
                    Start Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg outline-none transition-all duration-300"
                    style={{ background: 'var(--color-background)', border: '1px solid var(--card-border)', color: 'var(--color-text)' }}
                  />
                </div>

                {/* End Date */}
                <div>
                  <label className="block text-sm font-medium mb-2" style={COMMON_INLINE_STYLES.text}>
                    End Date
                  </label>
                  <input
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    disabled={formData.current}
                    className="w-full px-4 py-3 rounded-lg outline-none transition-all duration-300 disabled:opacity-50"
                    style={{ background: 'var(--color-background)', border: '1px solid var(--card-border)', color: 'var(--color-text)' }}
                  />
                </div>
              </div>

              {/* Current Position Checkbox */}
              <div className="mt-6">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.current}
                    onChange={(e) => setFormData({ ...formData, current: e.target.checked, end_date: e.target.checked ? '' : formData.end_date })}
                    className="w-5 h-5 rounded"
                    style={{ accentColor: 'var(--color-primary)' }}
                  />
                  <span className="text-sm font-medium" style={COMMON_INLINE_STYLES.text}>
                    This is my current position
                  </span>
                </label>
              </div>

              {/* Description */}
              <div className="mt-6">
                <label className="block text-sm font-medium mb-2" style={COMMON_INLINE_STYLES.text}>
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  placeholder="Brief overview of your role..."
                  className="w-full px-4 py-3 rounded-lg outline-none transition-all duration-300 resize-none"
                  style={{ background: 'var(--color-background)', border: '1px solid var(--card-border)', color: 'var(--color-text)' }}
                />
              </div>

              {/* Technologies */}
              <div className="mt-6">
                <label className="block text-sm font-medium mb-2" style={COMMON_INLINE_STYLES.text}>
                  Technologies * <span className="text-xs font-normal" style={COMMON_INLINE_STYLES.textMuted}>(at least one required)</span>
                </label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={techInput}
                    onChange={(e) => setTechInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTechnology())}
                    placeholder="e.g., React, TypeScript"
                    className="flex-1 px-4 py-3 rounded-lg outline-none transition-all duration-300"
                    style={{ background: 'var(--color-background)', border: '1px solid var(--card-border)', color: 'var(--color-text)' }}
                  />
                  <button
                    type="button"
                    onClick={addTechnology}
                    className="px-4 py-3 rounded-lg font-medium transition-all duration-300 hover:scale-105 flex items-center gap-2"
                    style={{ background: THEME_GRADIENTS.secondary, border: '1px solid var(--color-primary)', ...COMMON_INLINE_STYLES.text }}
                  >
                    <Plus className="w-4 h-4" />
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm"
                      style={{ background: THEME_GRADIENTS.secondary, border: '1px solid var(--color-primary)', ...COMMON_INLINE_STYLES.text }}
                    >
                      {tech}
                      <button type="button" onClick={() => removeTechnology(tech)} className="hover:scale-110 transition-transform">
                        <X className="w-4 h-4" />
                      </button>
                    </span>
                  ))}
                  {formData.technologies.length === 0 && (
                    <span className="text-sm" style={COMMON_INLINE_STYLES.textMuted}>
                      No technologies added yet
                    </span>
                  )}
                </div>
              </div>

              {/* Responsibilities */}
              <div className="mt-6">
                <label className="block text-sm font-medium mb-2" style={COMMON_INLINE_STYLES.text}>
                  Responsibilities <span className="text-xs font-normal" style={COMMON_INLINE_STYLES.textMuted}>(optional)</span>
                </label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={responsibilityInput}
                    onChange={(e) => setResponsibilityInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addResponsibility())}
                    placeholder="e.g., Led team of 5 engineers"
                    className="flex-1 px-4 py-3 rounded-lg outline-none transition-all duration-300"
                    style={{ background: 'var(--color-background)', border: '1px solid var(--card-border)', color: 'var(--color-text)' }}
                  />
                  <button
                    type="button"
                    onClick={addResponsibility}
                    className="px-4 py-3 rounded-lg font-medium transition-all duration-300 hover:scale-105 flex items-center gap-2"
                    style={{ background: THEME_GRADIENTS.secondary, border: '1px solid var(--color-primary)', ...COMMON_INLINE_STYLES.text }}
                  >
                    <Plus className="w-4 h-4" />
                    Add
                  </button>
                </div>
                <ul className="space-y-2">
                  {formData.responsibilities.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 p-3 rounded-lg" style={{ background: 'var(--color-background)' }}>
                      <span className="flex-1 text-sm" style={COMMON_INLINE_STYLES.text}>
                        • {item}
                      </span>
                      <button type="button" onClick={() => removeResponsibility(item)} className="hover:scale-110 transition-transform">
                        <X className="w-4 h-4" style={{ color: '#ef4444' }} />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Achievements */}
              <div className="mt-6">
                <label className="block text-sm font-medium mb-2" style={COMMON_INLINE_STYLES.text}>
                  Achievements <span className="text-xs font-normal" style={COMMON_INLINE_STYLES.textMuted}>(optional)</span>
                </label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={achievementInput}
                    onChange={(e) => setAchievementInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAchievement())}
                    placeholder="e.g., Reduced deployment time by 60%"
                    className="flex-1 px-4 py-3 rounded-lg outline-none transition-all duration-300"
                    style={{ background: 'var(--color-background)', border: '1px solid var(--card-border)', color: 'var(--color-text)' }}
                  />
                  <button
                    type="button"
                    onClick={addAchievement}
                    className="px-4 py-3 rounded-lg font-medium transition-all duration-300 hover:scale-105 flex items-center gap-2"
                    style={{ background: THEME_GRADIENTS.secondary, border: '1px solid var(--color-primary)', ...COMMON_INLINE_STYLES.text }}
                  >
                    <Plus className="w-4 h-4" />
                    Add
                  </button>
                </div>
                <ul className="space-y-2">
                  {formData.achievements.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 p-3 rounded-lg" style={{ background: 'var(--color-background)' }}>
                      <span className="flex-1 text-sm" style={COMMON_INLINE_STYLES.text}>
                        • {item}
                      </span>
                      <button type="button" onClick={() => removeAchievement(item)} className="hover:scale-110 transition-transform">
                        <X className="w-4 h-4" style={{ color: '#ef4444' }} />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading || formData.technologies.length === 0}
                className="flex items-center gap-2 px-8 py-3 rounded-lg font-medium transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ background: THEME_GRADIENTS.primary, color: 'white' }}
              >
                <Save className="w-5 h-5" />
                {loading ? 'Creating...' : 'Create Experience'}
              </button>
              <Link
                href="/admin/experience"
                className="flex items-center gap-2 px-8 py-3 rounded-lg font-medium transition-all duration-300 hover:scale-[1.02]"
                style={{ background: THEME_GRADIENTS.secondary, border: '1px solid var(--color-primary)', ...COMMON_INLINE_STYLES.text }}
              >
                Cancel
              </Link>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}
