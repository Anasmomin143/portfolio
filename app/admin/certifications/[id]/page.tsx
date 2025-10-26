'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { FormLayout, FormGrid, FormInput, FormTextarea, FormDate, FormNumber, FormUrl } from '@/components/admin';

export default function EditCertificationPage() {
  const router = useRouter();
  const params = useParams();
  const certificationId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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

  useEffect(() => {
    const fetchCertification = async () => {
      try {
        const res = await fetch(`/api/admin/certifications/${certificationId}`);
        if (!res.ok) throw new Error('Failed to fetch certification');
        const data = await res.json();

        setFormData({
          name: data.name || '',
          issuer: data.issuer || '',
          issue_date: data.issue_date ? data.issue_date.split('T')[0] : '',
          expiry_date: data.expiry_date ? data.expiry_date.split('T')[0] : '',
          credential_id: data.credential_id || '',
          credential_url: data.credential_url || '',
          description: data.description || '',
          display_order: data.display_order || 0,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchCertification();
  }, [certificationId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const res = await fetch(`/api/admin/certifications/${certificationId}`, {
        method: 'PUT',
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
        throw new Error(data.error || 'Failed to update certification');
      }

      router.push('/admin/certifications');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-12rem)]">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
          <p className="text-sm text-muted-foreground">
            Loading certification...
          </p>
        </div>
      </div>
    );
  }

  return (
    <FormLayout
            onSubmit={handleSubmit}
            error={error}
            isLoading={saving}
            submitLabel="Save Changes"
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
  );
}
