'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PageHeader, FormLayout, FormGrid, FormInput, FormTextarea, FormDate, FormNumber, FormUrl } from '@/components/admin';

export default function NewCertificationPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    issuer: '',
    issue_date: '',
    expiry_date: '',
    credential_id: '',
    credential_url: '',
    description: '',
    display_order: 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/certifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          expiry_date: formData.expiry_date || null,
          credential_id: formData.credential_id || null,
          credential_url: formData.credential_url || null,
          description: formData.description || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to create certification');
      }

      router.push('/admin/certifications');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setLoading(false);
    }
  };

  return (
    <div>
          <PageHeader
            title="Add New Certification"
            backHref="/admin/certifications"
            backLabel="Back to Certifications"
          />

          <FormLayout
            onSubmit={handleSubmit}
            error={error}
            isLoading={loading}
            submitLabel="Create Certification"
            cancelHref="/admin/certifications"
          >
            <FormGrid>
              <FormInput
                label="Certification Name"
                value={formData.name}
                onChange={(value) => setFormData({ ...formData, name: value })}
                placeholder="e.g., AWS Certified Solutions Architect"
                required
              />

              <FormInput
                label="Issuing Organization"
                value={formData.issuer}
                onChange={(value) => setFormData({ ...formData, issuer: value })}
                placeholder="e.g., Amazon Web Services"
                required
              />

              <FormDate
                label="Issue Date"
                value={formData.issue_date}
                onChange={(value) => setFormData({ ...formData, issue_date: value })}
                required
              />

              <FormDate
                label="Expiry Date"
                value={formData.expiry_date}
                onChange={(value) => setFormData({ ...formData, expiry_date: value })}
                hint="Leave empty if certification doesn't expire"
              />

              <FormInput
                label="Credential ID"
                value={formData.credential_id}
                onChange={(value) => setFormData({ ...formData, credential_id: value })}
                placeholder="e.g., ABC123XYZ"
                hint="Optional"
              />

              <FormUrl
                label="Credential URL"
                value={formData.credential_url}
                onChange={(value) => setFormData({ ...formData, credential_url: value })}
                placeholder="https://..."
                hint="Link to verify the credential"
              />

              <FormNumber
                label="Display Order"
                value={formData.display_order}
                onChange={(value) => setFormData({ ...formData, display_order: value })}
                min={0}
                hint="Lower numbers appear first"
              />
            </FormGrid>

            <FormTextarea
              label="Description"
              value={formData.description}
              onChange={(value) => setFormData({ ...formData, description: value })}
              placeholder="Brief description of the certification..."
              rows={3}
              hint="Optional"
            />
          </FormLayout>
    </div>
  );
}
