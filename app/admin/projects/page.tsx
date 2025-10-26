'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { COMMON_INLINE_STYLES, THEME_GRADIENTS } from '@/lib/constants/styles';
import { Edit, Trash2, ExternalLink, Github, Calendar, FolderGit2 } from 'lucide-react';
import { Chip } from '@/components/ui/chip';
import { useDeleteConfirmation } from '@/hooks/use-delete-confirmation';
import { EmptyState, DataWrapper } from '@/components/admin';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { fetchProjects, deleteProject } from '@/lib/redux/slices/projectsSlice';
import { addToast } from '@/lib/redux/slices/uiSlice';

export default function ProjectsPage() {
  const dispatch = useAppDispatch();
  const { items: projects, loading, error } = useAppSelector((state) => state.projects);

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  const handleDeleteProject = async (id: string) => {
    try {
      await dispatch(deleteProject(id)).unwrap();
      dispatch(addToast({
        type: 'success',
        message: 'Project deleted successfully',
      }));
    } catch (error) {
      dispatch(addToast({
        type: 'error',
        message: error as string,
      }));
      throw error; // Re-throw for confirmation dialog
    }
  };

  const { openDialog, ConfirmationDialog } = useDeleteConfirmation({
    onDelete: handleDeleteProject,
    entityName: 'project',
  });

  const refetch = () => {
    dispatch(fetchProjects());
  };

  return (
    <DataWrapper
      loading={loading}
      error={error}
      onRetry={refetch}
      loadingMessage="Loading projects..."
    >
      <div>
        {/* Projects Grid */}
        {!projects || projects.length === 0 ? (
          <EmptyState
            title="No projects yet"
            description="Get started by adding your first project"
            action={{
              label: 'Add Project',
              href: '/admin/projects/new',
            }}
            icon={<FolderGit2 className="h-16 w-16" />}
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {projects.map((project) => (
              <div
                key={project.id}
                className="rounded-xl p-6 card-hover"
                style={{ background: THEME_GRADIENTS.card, border: '1px solid var(--card-border)' }}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2" style={COMMON_INLINE_STYLES.text}>
                      {project.name}
                    </h3>
                    <p className="text-sm mb-2" style={{ color: 'var(--color-primary)' }}>
                      {project.company}
                    </p>
                  </div>
                  {project.current && (
                    <Chip variant="primary" size="sm" animated={false}>
                      Active
                    </Chip>
                  )}
                </div>

                {/* Date */}
                <div className="flex items-center gap-2 text-xs mb-3" style={COMMON_INLINE_STYLES.textMuted}>
                  <Calendar className="w-3 h-3" />
                  <span>
                    {new Date(project.start_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} -{' '}
                    {project.current ? 'Present' : project.end_date ? new Date(project.end_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'N/A'}
                  </span>
                </div>

                {/* Description */}
                <p className="text-sm mb-4 line-clamp-2" style={COMMON_INLINE_STYLES.textMuted}>
                  {project.description}
                </p>

                {/* Technologies */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies.slice(0, 5).map((tech) => (
                    <Chip key={tech} variant="secondary" size="sm">
                      {tech}
                    </Chip>
                  ))}
                  {project.technologies.length > 5 && (
                    <Chip variant="outline" size="sm">
                      +{project.technologies.length - 5} more
                    </Chip>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 pt-4 border-t" style={{ borderColor: 'var(--card-border)' }}>
                  <Link
                    href={`/admin/projects/${project.id}`}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 hover:scale-105"
                    style={{ background: THEME_GRADIENTS.secondary, border: '1px solid var(--color-primary)', ...COMMON_INLINE_STYLES.text }}
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </Link>
                  <button
                    onClick={() => openDialog({ id: project.id, name: project.name })}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 hover:scale-105"
                    style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#ef4444' }}
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                  {project.demo_url && (
                    <a
                      href={project.demo_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-auto p-2 rounded-lg transition-all duration-300 hover:scale-110"
                      style={{ background: 'var(--color-background)' }}
                      title="View Demo"
                    >
                      <ExternalLink className="w-4 h-4" style={{ color: 'var(--color-primary)' }} />
                    </a>
                  )}
                  {project.github_url && (
                    <a
                      href={project.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg transition-all duration-300 hover:scale-110"
                      style={{ background: 'var(--color-background)' }}
                      title="View Code"
                    >
                      <Github className="w-4 h-4" style={{ color: 'var(--color-primary)' }} />
                    </a>
                  )}
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
