'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { COMMON_INLINE_STYLES, THEME_GRADIENTS } from '@/lib/constants/styles';
import { Edit, Trash2, Calendar, MapPin, Briefcase } from 'lucide-react';
import { Chip } from '@/components/ui/chip';
import { useConfirmationDialog } from '@/hooks/use-delete-confirmation';
import { EmptyState, DataWrapper } from '@/components/admin';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { fetchExperience, deleteExperience } from '@/lib/redux/slices/experienceSlice';
import { addToast } from '@/lib/redux/slices/uiSlice';

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
  const dispatch = useAppDispatch();
  const { items: experiences, loading, error } = useAppSelector((state) => state.experience);

  useEffect(() => {
    dispatch(fetchExperience());
  }, [dispatch]);

  const handleDeleteExperience = async (id: string) => {
    try {
      await dispatch(deleteExperience(id)).unwrap();
      dispatch(addToast({
        type: 'success',
        message: 'Experience deleted successfully',
      }));
    } catch (error) {
      dispatch(addToast({
        type: 'error',
        message: error as string,
      }));
      throw error; // Re-throw for confirmation dialog
    }
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

  const refetch = () => {
    dispatch(fetchExperience());
  };

  return (
    <DataWrapper
      loading={loading}
      error={error}
      onRetry={refetch}
      loadingMessage="Loading experience..."
    >
      <div>
          {/* Experience List */}
          {experiences?.length === 0 ? (
            <EmptyState
              title="No experience yet"
              description="Get started by adding your first work experience"
              action={{
                label: 'Add Experience',
                href: '/admin/experience/new',
              }}
              icon={<Briefcase className="h-16 w-16" />}
            />
          ) : (
            <div className="space-y-6">
              {experiences?.map((exp) => (
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
    </DataWrapper>
  );
}
