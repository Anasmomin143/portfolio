'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { COMMON_INLINE_STYLES, THEME_GRADIENTS } from '@/lib/constants/styles';
import { Plus, Edit, Trash2, Calendar, MapPin } from 'lucide-react';
import { Chip } from '@/components/ui/chip';
import { useConfirmationDialog } from '@/hooks/use-delete-confirmation';

interface Experience {
  id: string;
  company: string;
  position: string;
  location: string | null;
  start_date: string;
  end_date: string | null;
  current: boolean;
  description: string | null;
  responsibilities: string[];
  technologies: string[];
  achievements: string[];
  display_order: number;
}

export default function ExperiencePage() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const handleDeleteExperience = async (id: string) => {
    const res = await fetch(`/api/admin/experience/${id}`, {
      method: 'DELETE',
    });

    if (!res.ok) throw new Error('Failed to delete experience');

    setExperiences(experiences.filter((exp) => exp.id !== id));
  };

  const { openDialog, ConfirmationDialog } = useConfirmationDialog({
    onConfirm: handleDeleteExperience,
    config: {
      title: 'Delete Experience?',
      description: (item) => (
        <>
          This will permanently delete <strong>&quot;{item.position} at {item.company}&quot;</strong>.
          This action cannot be undone.
        </>
      ),
      actionLabel: 'Delete',
      actionButtonClass: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
      successMessage: (item) => `${item.position} at ${item.company} deleted successfully`,
      errorMessage: 'Failed to delete experience',
    }
  });

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    try {
      const res = await fetch('/api/admin/experience');
      if (!res.ok) throw new Error('Failed to fetch experiences');
      const data = await res.json();
      setExperiences(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: 'var(--color-primary)' }} />
      </div>
    );
  }

  return (
    <div>
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2" style={COMMON_INLINE_STYLES.text}>
                Experience
              </h1>
              <p className="text-lg" style={COMMON_INLINE_STYLES.textMuted}>
                Manage your work experience
              </p>
            </div>
            <Link
              href="/admin/experience/new"
              className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 hover:scale-[1.02]"
              style={{ background: THEME_GRADIENTS.primary, color: 'white' }}
            >
              <Plus className="w-5 h-5" />
              Add Experience
            </Link>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 rounded-lg" style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
              <p style={{ color: '#ef4444' }}>{error}</p>
            </div>
          )}

          {/* Experience List */}
          {experiences.length === 0 ? (
            <div className="text-center py-16 rounded-xl" style={{ background: THEME_GRADIENTS.card, border: '1px solid var(--card-border)' }}>
              <p className="text-lg mb-4" style={COMMON_INLINE_STYLES.textMuted}>
                No experience yet
              </p>
              <Link
                href="/admin/experience/new"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 hover:scale-[1.02]"
                style={{ background: THEME_GRADIENTS.primary, color: 'white' }}
              >
                <Plus className="w-5 h-5" />
                Add Your First Experience
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {experiences.map((exp) => (
                <div
                  key={exp.id}
                  className="rounded-xl p-6 card-hover"
                  style={{ background: THEME_GRADIENTS.card, border: '1px solid var(--card-border)' }}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-2" style={COMMON_INLINE_STYLES.text}>
                        {exp.position}
                      </h3>
                      <p className="text-lg mb-2" style={{ color: 'var(--color-primary)' }}>
                        {exp.company}
                      </p>
                    </div>
                    {exp.current && (
                      <Chip variant="primary" size="sm" animated={false}>
                        Current
                      </Chip>
                    )}
                  </div>

                  {/* Meta Info */}
                  <div className="flex flex-wrap gap-4 text-sm mb-4" style={COMMON_INLINE_STYLES.textMuted}>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {new Date(exp.start_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} -{' '}
                        {exp.current ? 'Present' : exp.end_date ? new Date(exp.end_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'N/A'}
                      </span>
                    </div>
                    {exp.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{exp.location}</span>
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  {exp.description && (
                    <p className="text-sm mb-4" style={COMMON_INLINE_STYLES.textMuted}>
                      {exp.description}
                    </p>
                  )}

                  {/* Technologies */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {exp.technologies.slice(0, 8).map((tech) => (
                      <Chip key={tech} variant="secondary" size="sm">
                        {tech}
                      </Chip>
                    ))}
                    {exp.technologies.length > 8 && (
                      <Chip variant="outline" size="sm">
                        +{exp.technologies.length - 8} more
                      </Chip>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3 pt-4 border-t" style={{ borderColor: 'var(--card-border)' }}>
                    <Link
                      href={`/admin/experience/${exp.id}`}
                      className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 hover:scale-105"
                      style={{ background: THEME_GRADIENTS.secondary, border: '1px solid var(--color-primary)', ...COMMON_INLINE_STYLES.text }}
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </Link>
                    <button
                      onClick={() => openDialog({
                        id: exp.id,
                        name: `${exp.position} at ${exp.company}`,
                        position: exp.position,
                        company: exp.company
                      })}
                      className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 hover:scale-105"
                      style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#ef4444' }}
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

      <ConfirmationDialog />
    </div>
  );
}
