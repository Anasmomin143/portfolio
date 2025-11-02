/**
 * EXAMPLE: Multi-Tenant Portfolio Page
 *
 * This example shows how to update public portfolio pages to use
 * subdomain-based data instead of static JSON files.
 *
 * Apply this pattern to:
 * - app/[lang]/resume/page.tsx
 * - app/[lang]/projects/page.tsx
 * - app/[lang]/page.tsx (home page)
 * - Any other pages that display portfolio data
 */

'use client';

import { usePortfolio } from '@/hooks/usePortfolio';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function ExamplePortfolioPage() {
  // Fetch portfolio data from current subdomain
  const { data, loading, error } = usePortfolio();

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading portfolio...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Portfolio Not Found</h1>
          <p className="text-muted-foreground">{error || 'Unable to load portfolio data'}</p>
        </div>
      </div>
    );
  }

  const { tenant, projects, experience, skills, certifications } = data;

  // Format date helper
  const formatDate = (dateString: string | null, current: boolean) => {
    if (current) return 'Present';
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Tenant Name */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold">{tenant.name}</h1>
        <p className="text-muted-foreground">@{tenant.subdomain}</p>
      </div>

      {/* Experience Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6">Experience</h2>
        <div className="space-y-6">
          {experience.map((exp) => (
            <div key={exp.id} className="border-l-4 border-primary pl-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-xl font-bold">{exp.position}</h3>
                  <p className="text-lg text-primary font-semibold">{exp.company}</p>
                </div>
                <div className="text-right text-sm text-muted-foreground">
                  <p>{formatDate(exp.start_date, false)} - {formatDate(exp.end_date, exp.current)}</p>
                  {exp.location && <p>{exp.location}</p>}
                </div>
              </div>

              {exp.description && <p className="mb-3 text-muted-foreground">{exp.description}</p>}

              {exp.responsibilities.length > 0 && (
                <ul className="list-disc list-outside ml-5 space-y-1 mb-3">
                  {exp.responsibilities.map((resp, idx) => (
                    <li key={idx}>{resp}</li>
                  ))}
                </ul>
              )}

              {exp.technologies.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {exp.technologies.map((tech, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Projects Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6">Projects</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {projects.map((project) => (
            <div key={project.id} className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-bold">{project.name}</h3>
                {project.current && (
                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">Active</span>
                )}
              </div>

              <p className="text-sm text-muted-foreground mb-2">{project.company}</p>
              <p className="mb-3">{project.description}</p>

              {project.highlights.length > 0 && (
                <ul className="list-disc list-outside ml-5 space-y-1 mb-3 text-sm">
                  {project.highlights.map((highlight, idx) => (
                    <li key={idx}>{highlight}</li>
                  ))}
                </ul>
              )}

              <div className="flex flex-wrap gap-2 mb-3">
                {project.technologies.map((tech, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              {(project.demo_url || project.github_url) && (
                <div className="flex gap-2">
                  {project.demo_url && (
                    <a
                      href={project.demo_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline"
                    >
                      View Demo →
                    </a>
                  )}
                  {project.github_url && (
                    <a
                      href={project.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline"
                    >
                      View Code →
                    </a>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Skills Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6">Skills</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Group skills by category */}
          {Object.entries(
            skills.reduce((acc, skill) => {
              if (!acc[skill.category]) acc[skill.category] = [];
              acc[skill.category].push(skill);
              return acc;
            }, {} as Record<string, typeof skills>)
          ).map(([category, categorySkills]) => (
            <div key={category} className="border rounded-lg p-4">
              <h3 className="font-bold mb-3 capitalize">
                {category.replace(/([A-Z])/g, ' $1').trim()}
              </h3>
              <div className="space-y-2">
                {categorySkills.map((skill) => (
                  <div key={skill.id} className="flex items-center justify-between">
                    <span className="text-sm">{skill.skill_name}</span>
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className={`w-2 h-2 rounded-full ${
                            i < skill.proficiency_level ? 'bg-primary' : 'bg-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Certifications Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6">Certifications</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {certifications.map((cert) => (
            <div key={cert.id} className="border-l-4 border-primary pl-4">
              <h3 className="font-bold">{cert.name}</h3>
              <p className="text-sm text-muted-foreground">
                {cert.issuer} • {formatDate(cert.issue_date, false)}
              </p>
              {cert.description && <p className="text-sm mt-1">{cert.description}</p>}
              {cert.credential_url && (
                <a
                  href={cert.credential_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline mt-1 inline-block"
                >
                  View Credential →
                </a>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

/**
 * MIGRATION STEPS FOR EXISTING PAGES:
 *
 * 1. Import the hook:
 *    import { usePortfolio } from '@/hooks/usePortfolio';
 *
 * 2. Replace static import:
 *    // OLD: import resumeData from '@/data/resume.json';
 *    // NEW: const { data, loading, error } = usePortfolio();
 *
 * 3. Add loading and error states (see example above)
 *
 * 4. Update data references:
 *    // OLD: resumeData.projects
 *    // NEW: data.projects
 *
 * 5. Update field names to match database schema:
 *    // OLD: project.startDate
 *    // NEW: project.start_date
 *
 * 6. Test with multiple tenant subdomains to verify isolation
 */
