'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { AdminSidebar, PageHeader, FormLayout, FormGrid, FormInput, FormTextarea, ArrayInput, FormCheckbox, FormDate, FormNumber } from '@/components/admin';

export default function EditExperiencePage() {
  const router = useRouter();
  const params = useParams();
  const experienceId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    company: '',
    position: '',
    location: '',
    start_date: '',
    end_date: '',
    current: false,
    description: '',
    responsibilities: [] as string[],
    technologies: [] as string[],
    achievements: [] as string[],
    display_order: 0,
  });

  useEffect(() => {
    const fetchExperience = async () => {
      try {
        const res = await fetch(`/api/admin/experience/${experienceId}`);
        if (!res.ok) throw new Error('Failed to fetch experience');
        const data = await res.json();

        setFormData({
          ...data,
          start_date: data.start_date ? data.start_date.split('T')[0] : '',
          end_date: data.end_date ? data.end_date.split('T')[0] : '',
          location: data.location || '',
          description: data.description || '',
          responsibilities: data.responsibilities || [],
          technologies: data.technologies || [],
          achievements: data.achievements || [],
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchExperience();
  }, [experienceId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const res = await fetch(`/api/admin/experience/${experienceId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          end_date: formData.current ? null : formData.end_date || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to update experience');
      }

      router.push('/admin/experience');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex bg-background">
        <AdminSidebar user={{ email: '', name: 'Admin' }} />
        <div className="flex-1 lg:ml-64 p-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-background">
      <AdminSidebar user={{ email: '', name: 'Admin' }} />
      <div className="flex-1 lg:ml-64">
        <main className="p-6 lg:p-8">
          <PageHeader
            title="Edit Experience"
            backHref="/admin/experience"
            backLabel="Back to Experience"
          />

          <FormLayout
            onSubmit={handleSubmit}
            error={error}
            isLoading={saving}
            submitLabel="Save Changes"
            cancelHref="/admin/experience"
          >
            <FormGrid>
              <FormInput
                label="Company"
                value={formData.company}
                onChange={(value) => setFormData({ ...formData, company: value })}
                required
              />

              <FormInput
                label="Position"
                value={formData.position}
                onChange={(value) => setFormData({ ...formData, position: value })}
                required
              />

              <FormInput
                label="Location"
                value={formData.location}
                onChange={(value) => setFormData({ ...formData, location: value })}
              />

              <FormNumber
                label="Display Order"
                value={formData.display_order}
                onChange={(value) => setFormData({ ...formData, display_order: value })}
                min={0}
                hint="Lower numbers appear first"
              />

              <FormDate
                label="Start Date"
                value={formData.start_date}
                onChange={(value) => setFormData({ ...formData, start_date: value })}
                required
              />

              <FormDate
                label="End Date"
                value={formData.end_date}
                onChange={(value) => setFormData({ ...formData, end_date: value })}
                disabled={formData.current}
              />
            </FormGrid>

            <FormCheckbox
              label="This is my current position"
              checked={formData.current}
              onChange={(checked) =>
                setFormData({
                  ...formData,
                  current: checked,
                  end_date: checked ? '' : formData.end_date,
                })
              }
              description="Check this if you are currently working in this role"
            />

            <FormTextarea
              label="Description"
              value={formData.description}
              onChange={(value) => setFormData({ ...formData, description: value })}
              rows={3}
            />

            <ArrayInput
              label="Technologies"
              value={formData.technologies}
              onChange={(value) => setFormData({ ...formData, technologies: value })}
              required
              hint="At least one technology is required"
              variant="chips"
            />

            <ArrayInput
              label="Responsibilities"
              value={formData.responsibilities}
              onChange={(value) => setFormData({ ...formData, responsibilities: value })}
              variant="list"
            />

            <ArrayInput
              label="Achievements"
              value={formData.achievements}
              onChange={(value) => setFormData({ ...formData, achievements: value })}
              variant="list"
            />
          </FormLayout>
        </main>
      </div>
    </div>
  );
}
