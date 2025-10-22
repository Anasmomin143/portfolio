'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { AdminSidebar } from '@/components/admin/admin-sidebar';
import { COMMON_INLINE_STYLES, THEME_GRADIENTS } from '@/lib/constants/styles';
import { ArrowLeft, Save, Plus, X } from 'lucide-react';

interface ProjectFormData {
  id: string;
  name: string;
  company: string;
  description: string;
  start_date: string;
  end_date: string;
  current: boolean;
  technologies: string[];
  highlights: string[];
  demo_url: string;
  github_url: string;
  display_order: number;
}

export default function EditProjectPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState<ProjectFormData>({
    id: '',
    name: '',
    company: '',
    description: '',
    start_date: '',
    end_date: '',
    current: false,
    technologies: [],
    highlights: [],
    demo_url: '',
    github_url: '',
    display_order: 0,
  });

  const [techInput, setTechInput] = useState('');
  const [highlightInput, setHighlightInput] = useState('');

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await fetch(`/api/admin/projects/${projectId}`);
        if (!res.ok) throw new Error('Failed to fetch project');
        const data = await res.json();

        // Format dates for input fields
        setFormData({
          ...data,
          start_date: data.start_date ? data.start_date.split('T')[0] : '',
          end_date: data.end_date ? data.end_date.split('T')[0] : '',
          technologies: data.technologies || [],
          highlights: data.highlights || [],
          demo_url: data.demo_url || '',
          github_url: data.github_url || '',
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [projectId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const res = await fetch(`/api/admin/projects/${projectId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          end_date: formData.current ? null : formData.end_date || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to update project');
      }

      router.push('/admin/projects');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setSaving(false);
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

  const addHighlight = () => {
    if (highlightInput.trim() && !formData.highlights.includes(highlightInput.trim())) {
      setFormData({ ...formData, highlights: [...formData.highlights, highlightInput.trim()] });
      setHighlightInput('');
    }
  };

  const removeHighlight = (highlight: string) => {
    setFormData({ ...formData, highlights: formData.highlights.filter((h) => h !== highlight) });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex" style={{ background: 'var(--color-background)' }}>
        <AdminSidebar user={{ email: '', name: 'Admin' }} />
        <div className="flex-1 lg:ml-64 p-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: 'var(--color-primary)' }} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--color-background)' }}>
      <AdminSidebar user={{ email: '', name: 'Admin' }} />
      <div className="flex-1 lg:ml-64">
        <main className="p-6 lg:p-8">
          {/* Header */}
          <div className="mb-8">
            <Link
              href="/admin/projects"
              className="inline-flex items-center gap-2 text-sm mb-4 hover:underline"
              style={COMMON_INLINE_STYLES.textMuted}
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Projects
            </Link>
            <h1 className="text-3xl font-bold" style={COMMON_INLINE_STYLES.text}>
              Edit Project
            </h1>
          </div>

          {/* Form - Same as New Project but with pre-filled data */}
          <form onSubmit={handleSubmit} className="max-w-4xl">
            <div className="rounded-xl p-6 mb-6" style={{ background: THEME_GRADIENTS.card, border: '1px solid var(--card-border)' }}>
              {error && (
                <div className="mb-6 p-4 rounded-lg" style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
                  <p style={{ color: '#ef4444' }}>{error}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Project ID (Read-only) */}
                <div>
                  <label className="block text-sm font-medium mb-2" style={COMMON_INLINE_STYLES.text}>
                    Project ID
                  </label>
                  <input
                    type="text"
                    value={formData.id}
                    readOnly
                    className="w-full px-4 py-3 rounded-lg outline-none opacity-60 cursor-not-allowed"
                    style={{ background: 'var(--color-background)', border: '1px solid var(--card-border)', color: 'var(--color-text)' }}
                  />
                </div>

                {/* Project Name */}
                <div>
                  <label className="block text-sm font-medium mb-2" style={COMMON_INLINE_STYLES.text}>
                    Project Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg outline-none transition-all duration-300"
                    style={{ background: 'var(--color-background)', border: '1px solid var(--card-border)', color: 'var(--color-text)' }}
                  />
                </div>

                {/* Company */}
                <div>
                  <label className="block text-sm font-medium mb-2" style={COMMON_INLINE_STYLES.text}>
                    Company/Client *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
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

                {/* Demo URL */}
                <div>
                  <label className="block text-sm font-medium mb-2" style={COMMON_INLINE_STYLES.text}>
                    Demo URL
                  </label>
                  <input
                    type="url"
                    value={formData.demo_url}
                    onChange={(e) => setFormData({ ...formData, demo_url: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg outline-none transition-all duration-300"
                    style={{ background: 'var(--color-background)', border: '1px solid var(--card-border)', color: 'var(--color-text)' }}
                  />
                </div>

                {/* GitHub URL */}
                <div>
                  <label className="block text-sm font-medium mb-2" style={COMMON_INLINE_STYLES.text}>
                    GitHub URL
                  </label>
                  <input
                    type="url"
                    value={formData.github_url}
                    onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg outline-none transition-all duration-300"
                    style={{ background: 'var(--color-background)', border: '1px solid var(--card-border)', color: 'var(--color-text)' }}
                  />
                </div>
              </div>

              {/* Current Project Checkbox */}
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
                    This is a current/ongoing project
                  </span>
                </label>
              </div>

              {/* Description */}
              <div className="mt-6">
                <label className="block text-sm font-medium mb-2" style={COMMON_INLINE_STYLES.text}>
                  Description *
                </label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg outline-none transition-all duration-300 resize-none"
                  style={{ background: 'var(--color-background)', border: '1px solid var(--card-border)', color: 'var(--color-text)' }}
                />
              </div>

              {/* Technologies */}
              <div className="mt-6">
                <label className="block text-sm font-medium mb-2" style={COMMON_INLINE_STYLES.text}>
                  Technologies *
                </label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={techInput}
                    onChange={(e) => setTechInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTechnology())}
                    placeholder="Add a technology"
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
                </div>
              </div>

              {/* Highlights */}
              <div className="mt-6">
                <label className="block text-sm font-medium mb-2" style={COMMON_INLINE_STYLES.text}>
                  Highlights
                </label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={highlightInput}
                    onChange={(e) => setHighlightInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addHighlight())}
                    placeholder="Add a highlight"
                    className="flex-1 px-4 py-3 rounded-lg outline-none transition-all duration-300"
                    style={{ background: 'var(--color-background)', border: '1px solid var(--card-border)', color: 'var(--color-text)' }}
                  />
                  <button
                    type="button"
                    onClick={addHighlight}
                    className="px-4 py-3 rounded-lg font-medium transition-all duration-300 hover:scale-105 flex items-center gap-2"
                    style={{ background: THEME_GRADIENTS.secondary, border: '1px solid var(--color-primary)', ...COMMON_INLINE_STYLES.text }}
                  >
                    <Plus className="w-4 h-4" />
                    Add
                  </button>
                </div>
                <ul className="space-y-2">
                  {formData.highlights.map((highlight, idx) => (
                    <li key={idx} className="flex items-start gap-3 p-3 rounded-lg" style={{ background: 'var(--color-background)' }}>
                      <span className="flex-1 text-sm" style={COMMON_INLINE_STYLES.text}>
                        • {highlight}
                      </span>
                      <button type="button" onClick={() => removeHighlight(highlight)} className="hover:scale-110 transition-transform">
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
                disabled={saving || formData.technologies.length === 0}
                className="flex items-center gap-2 px-8 py-3 rounded-lg font-medium transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ background: THEME_GRADIENTS.primary, color: 'white' }}
              >
                <Save className="w-5 h-5" />
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
              <Link
                href="/admin/projects"
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
