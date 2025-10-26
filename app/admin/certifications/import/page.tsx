import { JsonImportPage } from '@/components/admin/json-import-page';

const exampleJSON = {
  certifications: [
    {
      id: '550e8400-e29b-41d4-a716-446655440005',
      name: 'AWS Certified Solutions Architect',
      issuer: 'Amazon Web Services',
      issue_date: '2023-01-15',
      expiry_date: '2026-01-15',
      credential_id: 'AWS-CSA-123456',
      credential_url: 'https://aws.amazon.com/verify/123456',
      description: 'Professional level AWS certification for designing distributed systems',
      display_order: 1
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440006',
      name: 'Certified Kubernetes Administrator',
      issuer: 'Cloud Native Computing Foundation',
      issue_date: '2023-06-01',
      expiry_date: '2026-06-01',
      credential_id: 'CKA-789012',
      credential_url: 'https://cncf.io/verify/789012',
      description: 'Expertise in Kubernetes cluster administration',
      display_order: 2
    }
  ]
};

export default function ImportCertificationsPage() {
  return (
    <JsonImportPage
      entityName="certification"
      entityNamePlural="certifications"
      apiEndpoint="/api/admin/certifications/import"
      redirectPath="/admin/certifications"
      backPath="/admin/certifications"
      exampleJson={exampleJSON}
    />
  );
}
