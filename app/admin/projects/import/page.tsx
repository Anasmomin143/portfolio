import { JsonImportPage } from '@/components/admin/json-import-page';

const exampleJSON = {
  projects: [
    {
      id: '550e8400-e29b-41d4-a716-446655440001',
      name: 'Example E-commerce Platform',
      company: 'Tech Company Inc.',
      description: 'A full-stack e-commerce platform with real-time inventory management',
      start_date: '2024-01-01',
      end_date: '2024-06-30',
      current: false,
      technologies: ['React', 'Next.js', 'TypeScript', 'PostgreSQL', 'Stripe'],
      highlights: [
        'Implemented real-time inventory sync',
        'Integrated payment processing with Stripe',
        'Achieved 99.9% uptime'
      ],
      demo_url: 'https://example.com',
      github_url: 'https://github.com/user/repo',
      display_order: 1
    }
  ]
};

export default function ImportProjectsPage() {
  return (
    <JsonImportPage
      entityName="project"
      entityNamePlural="projects"
      apiEndpoint="/api/admin/projects/import"
      redirectPath="/admin/projects"
      backPath="/admin/projects"
      exampleJson={exampleJSON}
    />
  );
}
