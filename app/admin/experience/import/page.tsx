import { JsonImportPage } from '@/components/admin/json-import-page';

const exampleJSON = {
  experience: [
    {
      id: '550e8400-e29b-41d4-a716-446655440002',
      company: 'Tech Company Inc.',
      position: 'Senior Software Engineer',
      start_date: '2022-01-01',
      end_date: '2024-06-30',
      current: false,
      description: 'Led development of microservices architecture',
      responsibilities: [
        'Designed and implemented scalable microservices',
        'Mentored junior developers',
        'Improved system performance by 40%'
      ],
      technologies: ['React', 'Node.js', 'Docker', 'Kubernetes'],
      location: 'San Francisco, CA',
      display_order: 1
    }
  ]
};

export default function ImportExperiencePage() {
  return (
    <JsonImportPage
      entityName="experience"
      entityNamePlural="experience"
      apiEndpoint="/api/admin/experience/import"
      redirectPath="/admin/experience"
      backPath="/admin/experience"
      exampleJson={exampleJSON}
    />
  );
}
