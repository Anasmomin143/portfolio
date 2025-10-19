// import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getAllProjects } from '@/lib/data';
import { LocaleParams } from '@/types';
import { slugify } from '@/lib/utils';
import { FadeIn } from '@/components/animations/fade-in';
import { ScaleIn } from '@/components/animations/scale-in';
import { StaggerContainer, StaggerItem } from '@/components/animations/stagger-container';
import { HoverCard } from '@/components/animations/hover-card';

export default async function ProjectsPage({ params }: { params: Promise<LocaleParams> }) {
  const { lang } = await params;
  // const t = await getTranslations();
  const projects = await getAllProjects();

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <FadeIn delay={0.2}>
          <div className="mb-8">
            <ScaleIn delay={0.4}>
              <span className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium" style={{ background: 'var(--gradient-secondary)', color: 'var(--color-primary)' }}>
                💼 My Work
              </span>
            </ScaleIn>
          </div>
        </FadeIn>
        
        <FadeIn delay={0.6} direction="up">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl" style={{ color: 'var(--color-text)' }}>
            Featured{' '}
            <span style={{ background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', color: 'transparent' }}>
              Projects
            </span>
          </h1>
        </FadeIn>
        
        <FadeIn delay={0.8} direction="up">
          <p className="mt-6 text-lg leading-8 max-w-3xl mx-auto" style={{ color: 'var(--color-muted)' }}>
            A collection of my recent work and personal projects. Each project represents
            a unique challenge and showcases different aspects of my development skills.
          </p>
        </FadeIn>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-secondary-500">No projects found</p>
        </div>
      ) : (
        <StaggerContainer className="grid gap-8 md:grid-cols-2 lg:grid-cols-3" staggerDelay={0.1}>
          {projects.map((project, index) => {
            const projectSlug = slugify(project.title);
            return (
              <StaggerItem key={project.id}>
                <HoverCard scaleOnHover={1.05} rotateOnHover={index % 2 === 0 ? 2 : -2}>
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video flex items-center justify-center relative overflow-hidden" style={{ background: 'var(--gradient-hero)' }}>
                  {project.imageUrl ? (
                    <img
                      src={project.imageUrl}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center z-10">
                      <div className="mx-auto h-16 w-16 rounded-2xl flex items-center justify-center shadow-medium mb-3" style={{ background: 'var(--gradient-primary)' }}>
                        <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c-.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                        </svg>
                      </div>
                      <p className="text-sm font-bold" style={{ color: 'var(--color-primary)' }}>💼 Project Preview</p>
                    </div>
                  )}
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, var(--color-primary), transparent)', opacity: 0.1 }}></div>
                </div>
                <CardHeader>
                  <CardTitle className="line-clamp-2">{project.title}</CardTitle>
                  <CardDescription className="line-clamp-3">
                    {project.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium mb-2" style={{ color: 'var(--color-muted)' }}>
                        Technologies Used
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {project.technologies.slice(0, 3).map((tech) => (
                          <span
                            key={tech}
                            className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold shadow-soft"
                            style={{ background: 'var(--gradient-secondary)', color: 'var(--color-primary)', borderColor: 'var(--color-primary)' }}
                          >
                            {tech}
                          </span>
                        ))}
                        {project.technologies.length > 3 && (
                          <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold shadow-soft" style={{ background: 'var(--gradient-secondary)', color: 'var(--color-muted)', borderColor: 'var(--color-muted)' }}>
                            +{project.technologies.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" className="flex-1" asChild>
                        <Link href={`/${lang}/projects/${projectSlug}`}>
                          View Details
                        </Link>
                      </Button>
                      {project.githubUrl && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                            Code
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
                </Card>
                </HoverCard>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      )}
    </div>
  );
}