import dynamic from 'next/dynamic';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LocaleParams } from '@/types';

// Dynamic imports for animations
const FadeIn = dynamic(() => import('@/components/animations/fade-in').then(mod => ({ default: mod.FadeIn })));
const ScaleIn = dynamic(() => import('@/components/animations/scale-in').then(mod => ({ default: mod.ScaleIn })));
const StaggerContainer = dynamic(() => import('@/components/animations/stagger-container').then(mod => ({ default: mod.StaggerContainer })));
const StaggerItem = dynamic(() => import('@/components/animations/stagger-container').then(mod => ({ default: mod.StaggerItem })));
const HoverCard = dynamic(() => import('@/components/animations/hover-card').then(mod => ({ default: mod.HoverCard })));

// Dynamic imports for icons
const User = dynamic(() => import('lucide-react').then(mod => ({ default: mod.User })));
const Building = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Building })));
const Rocket = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Rocket })));

export default async function AboutPage({ params }: { params: Promise<LocaleParams> }) {
  const { lang } = await params;

  const skills = [
    { name: 'Next.js', category: 'frontend', level: 'advanced' },
    { name: 'React', category: 'frontend', level: 'expert' },
    { name: 'TypeScript', category: 'frontend', level: 'advanced' },
    { name: 'Tailwind CSS', category: 'frontend', level: 'advanced' },
    { name: 'Node.js', category: 'backend', level: 'advanced' },
    { name: 'PostgreSQL', category: 'database', level: 'intermediate' },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <FadeIn delay={0.2}>
          <div className="mb-8">
            <ScaleIn delay={0.4}>
              <span className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold shadow-soft" style={{ background: 'var(--gradient-secondary)', color: 'var(--color-accent)', borderColor: 'var(--color-accent)' }}>
                <User className="w-4 h-4" />
                About Me
              </span>
            </ScaleIn>
          </div>
        </FadeIn>
        
        <FadeIn delay={0.6} direction="up">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl" style={{ color: 'var(--color-text)' }}>
            Passionate{' '}
            <span style={{ background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', color: 'transparent' }}>
              Developer
            </span>
          </h1>
        </FadeIn>
        
        <FadeIn delay={0.8} direction="up">
          <p className="mt-6 text-lg leading-8 max-w-3xl mx-auto" style={{ color: 'var(--color-muted)' }}>
            I&apos;m a passionate full-stack developer with expertise in modern web technologies.
            I love creating beautiful, functional, and scalable applications that solve real-world problems.
          </p>
        </FadeIn>
      </div>

      <StaggerContainer className="grid gap-12 lg:grid-cols-2" staggerDelay={0.2}>
        {/* Skills Section */}
        <StaggerItem index={0}>
          <HoverCard element="card">
            <Card>
              <CardHeader>
                <CardTitle>Skills</CardTitle>
                <CardDescription>Technologies and tools I work with</CardDescription>
              </CardHeader>
              <CardContent>
                <StaggerContainer className="grid gap-4" staggerDelay={0.05}>
                  {skills.map((skill, index) => (
                    <StaggerItem key={skill.name} index={index}>
                      <HoverCard element="text" className="flex justify-between items-center p-3 rounded-lg" style={{ background: 'var(--gradient-secondary)' }}>
                        <div>
                          <span className="font-medium" style={{ color: 'var(--color-text)' }}>{skill.name}</span>
                          <span className="text-sm ml-2" style={{ color: 'var(--color-muted)' }}>({skill.category})</span>
                        </div>
                        <span className="inline-flex items-center rounded-lg px-2 py-1 text-xs font-medium ring-1 ring-inset" style={{
                          backgroundColor: skill.level === 'expert' ? 'var(--color-accent)' : 
                                         skill.level === 'advanced' ? 'var(--color-primary)' : 
                                         'var(--color-secondary)',
                          color: 'white',
                          opacity: 0.9
                        }}>
                          {skill.level}
                        </span>
                      </HoverCard>
                    </StaggerItem>
                  ))}
                </StaggerContainer>
              </CardContent>
            </Card>
          </HoverCard>
        </StaggerItem>

        {/* Experience Section */}
        <StaggerItem index={1}>
          <HoverCard element="card">
            <Card>
          <CardHeader>
            <CardTitle>Experience</CardTitle>
            <CardDescription>My professional journey</CardDescription>
          </CardHeader>
          <CardContent>
            <StaggerContainer className="space-y-6" staggerDelay={0.1}>
              <StaggerItem index={0}>
                <HoverCard element="text">
                  <div className="pl-6 p-6 rounded-r-2xl shadow-soft hover:shadow-medium transition-all duration-300" style={{ borderLeft: `4px solid var(--color-primary)`, background: 'var(--gradient-card)' }}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="inline-block w-3 h-3 rounded-full animate-pulse" style={{ background: 'var(--gradient-primary)' }}></span>
                      <h3 className="font-bold" style={{ color: 'var(--color-text)' }}>Senior Full Stack Developer</h3>
                    </div>
                    <p className="text-sm font-semibold flex items-center gap-2" style={{ color: 'var(--color-primary)' }}>
                      <Building className="w-4 h-4" />
                      TechCorp • 2022 - Present
                    </p>
                    <p className="text-sm mt-3 leading-relaxed" style={{ color: 'var(--color-muted)' }}>
                      Leading development of modern web applications using React, Next.js, and Node.js.
                      Mentoring junior developers and implementing best practices.
                    </p>
                  </div>
                </HoverCard>
              </StaggerItem>
              
              <StaggerItem index={1}>
                <HoverCard element="text">
                  <div className="pl-6 p-6 rounded-r-2xl shadow-soft hover:shadow-medium transition-all duration-300" style={{ borderLeft: `4px solid var(--color-secondary)`, background: 'var(--gradient-card)' }}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: 'var(--color-secondary)' }}></span>
                      <h3 className="font-bold" style={{ color: 'var(--color-text)' }}>Full Stack Developer</h3>
                    </div>
                    <p className="text-sm font-semibold flex items-center gap-2" style={{ color: 'var(--color-secondary)' }}>
                      <Rocket className="w-4 h-4" />
                      StartupXYZ • 2020 - 2022
                    </p>
                    <p className="text-sm mt-3 leading-relaxed" style={{ color: 'var(--color-muted)' }}>
                      Built and maintained multiple client projects, implemented CI/CD pipelines,
                      and contributed to the company's core product development.
                    </p>
                  </div>
                </HoverCard>
              </StaggerItem>
            </StaggerContainer>
            </CardContent>
            </Card>
          </HoverCard>
        </StaggerItem>
      </StaggerContainer>
    </div>
  );
}