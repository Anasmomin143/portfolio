import { JsonImportPage } from '@/components/admin/json-import-page';

const exampleJSON = {
  skills: [
    {
      id: '550e8400-e29b-41d4-a716-446655440003',
      skill_name: 'React',
      category: 'Frontend',
      proficiency_level: 5,
      years_experience: 5.5,
      display_order: 1
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440004',
      skill_name: 'TypeScript',
      category: 'Language',
      proficiency_level: 4,
      years_experience: 4.0,
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
