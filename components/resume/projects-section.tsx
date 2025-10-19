'use client';

import { useProjects } from '@/hooks/useResumeData';
import dynamic from 'next/dynamic';
import Link from 'next/link';

const StaggerContainer = dynamic(() => import('@/components/animations/stagger-container').then(mod => ({ default: mod.StaggerContainer })));
const StaggerItem = dynamic(() => import('@/components/animations/stagger-container').then(mod => ({ default: mod.StaggerItem })));
const HoverCard = dynamic(() => import('@/components/animations/hover-card').then(mod => ({ default: mod.HoverCard })));
const Building = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Building })));
const Calendar = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Calendar })));
const ExternalLink = dynamic(() => import('lucide-react').then(mod => ({ default: mod.ExternalLink })));
const Github = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Github })));

export function ProjectsSection() {
  const { data: projects, loading, error } = useProjects();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: 'var(--color-primary)' }}></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p style={{ color: 'var(--color-muted)' }}>Failed to load projects data</p>
      </div>
    );
  }

  const formatDate = (dateString: string | null, current: boolean) => {
    if (current) return 'Present';
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  return (
    <StaggerContainer className="grid gap-8 md:grid-cols-2" staggerDelay={0.1}>
      {projects?.map((project, index) => (
        <StaggerItem key={project.id} index={index}>
          <HoverCard element="card">
            <div
              className="theme-card rounded-xl shadow-medium hover:shadow-strong transition-all duration-300 hover:scale-[1.02] backdrop-blur-sm overflow-hidden h-full flex flex-col"
              style={{ borderColor: 'var(--color-primary)' }}
            >
              {/* Project Header */}
              <div className="p-6 flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>
                      {project.name}
                    </h3>
                    <div className="flex items-center gap-2 text-sm mb-3" style={{ color: 'var(--color-muted)' }}>
                      <Building className="w-4 h-4" style={{ color: 'var(--color-primary)' }} />
                      <span className="font-medium">{project.company}</span>
                    </div>
                  </div>
                  {project.current && (
                    <span className="px-3 py-1 text-xs font-semibold rounded-full animate-pulse" style={{
                      background: 'var(--gradient-primary)',
                      color: 'white'
                    }}>
                      Active
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 text-xs mb-4" style={{ color: 'var(--color-muted)' }}>
                  <Calendar className="w-3 h-3" />
                  <span>
                    {formatDate(project.startDate, false)} - {formatDate(project.endDate, project.current)}
                  </span>
                </div>

                <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--color-muted)' }}>
                  {project.description}
                </p>

                {project.highlights && project.highlights.length > 0 && (
                  <ul className="space-y-2 mb-4">
                    {project.highlights.map((highlight, idx) => (
                      <li key={idx} className="text-sm flex gap-2" style={{ color: 'var(--color-muted)' }}>
                        <span style={{ color: 'var(--color-primary)' }}>•</span>
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                )}

                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies.map((tech, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 text-xs font-medium rounded-md"
                      style={{
                        background: 'var(--gradient-secondary)',
                        color: 'var(--color-primary)',
                        border: '1px solid var(--color-primary)',
                        opacity: 0.9
                      }}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Project Links */}
              {(project.demoUrl || project.githubUrl) && (
                <div className="px-6 py-4 border-t" style={{ borderColor: 'var(--card-border)' }}>
                  <div className="flex gap-3">
                    {project.demoUrl && (
                      <Link
                        href={project.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 hover:scale-105"
                        style={{ background: 'var(--gradient-primary)', color: 'white' }}
                      >
                        <ExternalLink className="w-4 h-4" />
                        View Demo
                      </Link>
                    )}
                    {project.githubUrl && (
                      <Link
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 hover:scale-105"
                        style={{
                          background: 'var(--gradient-secondary)',
                          color: 'var(--color-text)',
                          border: '1px solid var(--color-primary)'
                        }}
                      >
                        <Github className="w-4 h-4" />
                        Code
                      </Link>
                    )}
                  </div>
                </div>
              )}
            </div>
          </HoverCard>
        </StaggerItem>
      ))}
    </StaggerContainer>
  );
}
