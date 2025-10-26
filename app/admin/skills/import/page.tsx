import { JsonImportPage } from '@/components/admin/json-import-page';

const exampleJSON = {
  skills: [
    {
      id: '550e8400-e29b-41d4-a716-446655440003',
      name: 'React',
      category: 'Frontend',
      proficiency: 95,
      years_of_experience: 5.5,
      description: 'Advanced knowledge of React and its ecosystem',
      display_order: 1
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440004',
      name: 'TypeScript',
      category: 'Language',
      proficiency: 90,
      years_of_experience: 4.0,
      description: 'Strong understanding of type systems and advanced TypeScript features',
      display_order: 2
    }
  ]
};

export default function ImportSkillsPage() {
  return (
    <JsonImportPage
      entityName="skill"
      entityNamePlural="skills"
      apiEndpoint="/api/admin/skills/import"
      redirectPath="/admin/skills"
      backPath="/admin/skills"
      exampleJson={exampleJSON}
    />
  );
}
