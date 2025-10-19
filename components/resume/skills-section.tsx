'use client';

import { useSkills } from '@/hooks/useResumeData';
import dynamic from 'next/dynamic';

const StaggerContainer = dynamic(() => import('@/components/animations/stagger-container').then(mod => ({ default: mod.StaggerContainer })));
const StaggerItem = dynamic(() => import('@/components/animations/stagger-container').then(mod => ({ default: mod.StaggerItem })));
const HoverCard = dynamic(() => import('@/components/animations/hover-card').then(mod => ({ default: mod.HoverCard })));

export function SkillsSection() {
  const { data: skills, loading, error } = useSkills();

  if (loading) {
    const badgeWidths = ['80px', '100px', '90px', '110px', '85px', '95px'];

    return (
      <div className="space-y-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="p-6 rounded-xl animate-pulse" style={{ background: 'var(--gradient-card)' }}>
            {/* Category title skeleton */}
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1 h-6 bg-gray-300 dark:bg-gray-700 rounded-full" style={{ opacity: 0.3 }}></div>
              <div className="h-5 bg-gray-300 dark:bg-gray-700 rounded w-1/3" style={{ opacity: 0.3 }}></div>
            </div>

            {/* Skills badges skeleton */}
            <div className="flex flex-wrap gap-2">
              {badgeWidths.map((width, j) => (
                <div key={j} className="h-8 bg-gray-300 dark:bg-gray-700 rounded-lg" style={{
                  opacity: 0.3,
                  width: width
                }}></div>
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
        <p style={{ color: 'var(--color-muted)' }}>Failed to load skills data</p>
      </div>
    );
  }

  const skillCategories = [
    { title: 'Frontend Frameworks', skills: skills?.frontendFrameworks || [], color: 'var(--color-primary)' },
    { title: 'Languages', skills: skills?.languages || [], color: 'var(--color-accent)' },
    { title: 'Styling', skills: skills?.styling || [], color: 'var(--color-secondary)' },
    { title: 'State Management', skills: skills?.stateManagement || [], color: 'var(--color-primary)' },
    { title: 'Tools & DevOps', skills: skills?.tools || [], color: 'var(--color-accent)' },
    { title: 'Methodologies', skills: skills?.methodologies || [], color: 'var(--color-secondary)' },
  ];

  return (
    <StaggerContainer className="space-y-6" staggerDelay={0.1}>
      {skillCategories.map((category, catIndex) => (
        <StaggerItem key={category.title} index={catIndex}>
          <HoverCard element="text">
            <div className="p-6 rounded-xl" style={{ background: 'var(--gradient-card)' }}>
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2" style={{ color: 'var(--color-text)' }}>
                <span className="w-1 h-6 rounded-full" style={{ background: category.color }}></span>
                {category.title}
              </h3>
              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 hover:scale-105"
                    style={{
                      background: 'var(--gradient-secondary)',
                      color: category.color,
                      border: `1px solid ${category.color}`,
                      opacity: 0.9
                    }}
                  >
                    {skill}
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
