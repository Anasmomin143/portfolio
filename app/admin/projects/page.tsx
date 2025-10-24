'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { COMMON_INLINE_STYLES, THEME_GRADIENTS } from '@/lib/constants/styles';
import { Plus, Edit, Trash2, ExternalLink, Github as GithubIcon, Calendar, Upload } from 'lucide-react';
import { Chip } from '@/components/ui/chip';
import { useDeleteConfirmation, useConfirmationDialog } from '@/hooks/use-delete-confirmation';

interface Project {
  id: string;
  name: string;
  company: string;
  description: string;
  start_date: string;
  end_date: string | null;
  current: boolean;
  highlights: string[];
  technologies: string[];
  demo_url: string | null;
  github_url: string | null;
  display_order: number;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const handleDeleteProject = async (id: string) => {
    const res = await fetch(`/api/admin/projects/${id}`, {
      method: 'DELETE',
    });

    if (!res.ok) throw new Error('Failed to delete project');

    setProjects(projects.filter((p) => p.id !== id));
  };

  const { openDialog, ConfirmationDialog } = useDeleteConfirmation({
    onDelete: handleDeleteProject,
    entityName: 'project',
  });

  console.log("projects",projects)
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/admin/projects');
      if (!res.ok) throw new Error('Failed to fetch projects');
      const data = await res.json();
      setProjects(data);
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
                Projects
              </h1>
              <p className="text-lg" style={COMMON_INLINE_STYLES.textMuted}>
                Manage your portfolio projects
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                href="/admin/projects/import"
                className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 hover:scale-[1.02]"
                style={{ background: THEME_GRADIENTS.secondary, border: '1px solid var(--color-primary)', ...COMMON_INLINE_STYLES.text }}
              >
                <Upload className="w-5 h-5" />
                Import JSON
              </Link>
              <Link
                href="/admin/projects/new"
                className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 hover:scale-[1.02]"
                style={{ background: THEME_GRADIENTS.primary, color: 'white' }}
              >
                <Plus className="w-5 h-5" />
                Add Project
              </Link>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 rounded-lg" style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
              <p style={{ color: '#ef4444' }}>{error}</p>
            </div>
          )}

          {/* Projects Grid */}
          {projects.length === 0 ? (
            <div className="text-center py-16 rounded-xl" style={{ background: THEME_GRADIENTS.card, border: '1px solid var(--card-border)' }}>
              <p className="text-lg mb-4" style={COMMON_INLINE_STYLES.textMuted}>
                No projects yet
              </p>
              <Link
                href="/admin/projects/new"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 hover:scale-[1.02]"
                style={{ background: THEME_GRADIENTS.primary, color: 'white' }}
              >
                <Plus className="w-5 h-5" />
                Add Your First Project
              </Link>
            </div>
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
                        <GithubIcon className="w-4 h-4" style={{ color: 'var(--color-primary)' }} />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

      <ConfirmationDialog />
    </div>
  );
}
