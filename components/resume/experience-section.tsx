'use client';

import { useExperience } from '@/hooks/useResumeData';
import dynamic from 'next/dynamic';

const StaggerContainer = dynamic(() => import('@/components/animations/stagger-container').then(mod => ({ default: mod.StaggerContainer })));
const StaggerItem = dynamic(() => import('@/components/animations/stagger-container').then(mod => ({ default: mod.StaggerItem })));
const HoverCard = dynamic(() => import('@/components/animations/hover-card').then(mod => ({ default: mod.HoverCard })));
const Building = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Building })));
const MapPin = dynamic(() => import('lucide-react').then(mod => ({ default: mod.MapPin })));
const Calendar = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Calendar })));

export function ExperienceSection() {
  const { data: experience, loading, error } = useExperience();

  if (loading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="pl-6 p-6 rounded-r-2xl animate-pulse"
            style={{
              borderLeft: '4px solid var(--color-primary)',
              background: 'var(--gradient-card)'
            }}
          >
            {/* Position title skeleton */}
            <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-4" style={{ opacity: 0.3 }}></div>

            {/* Company and date skeleton */}
            <div className="space-y-2 mb-4">
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2" style={{ opacity: 0.3 }}></div>
              <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-2/3" style={{ opacity: 0.3 }}></div>
            </div>

            {/* Responsibilities skeleton */}
            <div className="space-y-2 mb-4">
              <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-full" style={{ opacity: 0.3 }}></div>
              <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-5/6" style={{ opacity: 0.3 }}></div>
              <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-4/5" style={{ opacity: 0.3 }}></div>
            </div>

            {/* Technologies skeleton */}
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3, 4, 5].map((j) => (
                <div key={j} className="h-6 bg-gray-300 dark:bg-gray-700 rounded-full w-20" style={{ opacity: 0.3 }}></div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p style={{ color: 'var(--color-muted)' }}>Failed to load experience data</p>
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
    <StaggerContainer className="space-y-6" staggerDelay={0.1}>
      {experience?.map((exp, index) => (
        <StaggerItem key={exp.id} index={index}>
          <HoverCard element="text">
            <div
              className="pl-6 p-6 rounded-r-2xl shadow-soft hover:shadow-medium transition-all duration-300"
              style={{
                borderLeft: `4px solid ${exp.current ? 'var(--color-primary)' : 'var(--color-secondary)'}`,
                background: 'var(--gradient-card)'
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                {exp.current && (
                  <span className="inline-block w-3 h-3 rounded-full animate-pulse" style={{ background: 'var(--gradient-primary)' }}></span>
                )}
                {!exp.current && (
                  <span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: 'var(--color-secondary)' }}></span>
                )}
                <h3 className="font-bold text-lg" style={{ color: 'var(--color-text)' }}>{exp.position}</h3>
              </div>

              <div className="space-y-2 mb-4">
                <p className="text-sm font-semibold flex items-center gap-2" style={{ color: exp.current ? 'var(--color-primary)' : 'var(--color-secondary)' }}>
                  <Building className="w-4 h-4" />
                  {exp.company}
                </p>
                <div className="flex flex-wrap gap-3 text-xs" style={{ color: 'var(--color-muted)' }}>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {formatDate(exp.startDate, false)} - {formatDate(exp.endDate, exp.current)}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {exp.location} • {exp.workMode}
                  </span>
                </div>
              </div>

              <ul className="space-y-2 mb-4">
                {exp.responsibilities.map((resp, idx) => (
                  <li key={idx} className="text-sm leading-relaxed flex gap-2" style={{ color: 'var(--color-muted)' }}>
                    <span style={{ color: 'var(--color-primary)' }}>•</span>
                    <span>{resp}</span>
                  </li>
                ))}
              </ul>

              <div className="flex flex-wrap gap-2">
                {exp.technologies.map((tech, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 text-xs font-medium rounded-full"
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
          </HoverCard>
        </StaggerItem>
      ))}
    </StaggerContainer>
  );
}
