'use client';

import { useProjects } from '@/hooks/useResumeData';
import { SectionContainer } from '@/components/common/section-container';
import { TechBadgeList } from '@/components/ui/tech-badge';
import { formatDate } from '@/lib/utils/dateUtils';
import { COMMON_INLINE_STYLES, THEME_GRADIENTS, TAILWIND_PATTERNS } from '@/lib/constants/styles';
import dynamic from 'next/dynamic';
import Link from 'next/link';

const StaggerItem = dynamic(() => import('@/components/animations/stagger-container').then(mod => ({ default: mod.StaggerItem })));
const HoverCard = dynamic(() => import('@/components/animations/hover-card').then(mod => ({ default: mod.HoverCard })));
const Building = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Building })));
const Calendar = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Calendar })));
const ExternalLink = dynamic(() => import('lucide-react').then(mod => ({ default: mod.ExternalLink })));
const Github = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Github })));

export function ProjectsSection() {
  const { data: projects, loading, error } = useProjects();

  return (
    <SectionContainer loading={loading} error={error} className="grid gap-8 md:grid-cols-2">
      {projects?.map((project, index) => (
        <StaggerItem key={project.id} index={index}>
          <HoverCard element="card">
            <div
              className={`theme-card ${TAILWIND_PATTERNS.card} ${TAILWIND_PATTERNS.cardHover} backdrop-blur-sm overflow-hidden h-full flex flex-col`}
              style={{ borderColor: 'var(--color-primary)' }}
            >
              {/* Project Header */}
              <div className="p-6 flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2" style={COMMON_INLINE_STYLES.text}>
                      {project.name}
                    </h3>
                    <div className="flex items-center gap-2 text-sm mb-3" style={COMMON_INLINE_STYLES.textMuted}>
                      <Building className="w-4 h-4" style={{ color: 'var(--color-primary)' }} />
                      <span className="font-medium">{project.company}</span>
                    </div>
                  </div>
                  {project.current && (
                    <span className="px-3 py-1 text-xs font-semibold rounded-full animate-pulse" style={{
                      background: THEME_GRADIENTS.primary,
                      color: 'white'
                    }}>
                      Active
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 text-xs mb-4" style={COMMON_INLINE_STYLES.textMuted}>
                  <Calendar className="w-3 h-3" />
                  <span>
                    {formatDate(project.startDate, false)} - {formatDate(project.endDate, project.current)}
                  </span>
                </div>

                <p className="text-sm leading-relaxed mb-4" style={COMMON_INLINE_STYLES.textMuted}>
                  {project.description}
                </p>

                {project.highlights && project.highlights.length > 0 && (
                  <ul className="space-y-2 mb-4">
                    {project.highlights.map((highlight, idx) => (
                      <li key={idx} className="text-sm flex gap-2" style={COMMON_INLINE_STYLES.textMuted}>
                        <span style={{ color: 'var(--color-primary)' }}>•</span>
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                )}

                <TechBadgeList technologies={project.technologies} variant="secondary" className="mb-4" />
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
                        className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg ${TAILWIND_PATTERNS.hoverScale}`}
                        style={{ background: THEME_GRADIENTS.primary, color: 'white' }}
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
                        className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg ${TAILWIND_PATTERNS.hoverScale}`}
                        style={{
                          background: THEME_GRADIENTS.secondary,
                          ...COMMON_INLINE_STYLES.text,
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
    </SectionContainer>
  );
}
