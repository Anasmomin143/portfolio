'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdminSidebar } from '@/components/admin';
import {
  PageHeader,
  FormLayout,
  FormGrid,
  FormInput,
  FormTextarea,
  ArrayInput,
  FormCheckbox,
  FormDate,
  FormNumber,
} from '@/components/admin';

export default function NewExperiencePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/experience', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          end_date: formData.current ? null : formData.end_date || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to create experience');
      }

      router.push('/admin/experience');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-background">
      <AdminSidebar user={{ email: '', name: 'Admin' }} />
      <div className="flex-1 lg:ml-64">
        <main className="p-6 lg:p-8">
          <PageHeader
            title="Add New Experience"
            backHref="/admin/experience"
            backLabel="Back to Experience"
          />

          <FormLayout
            onSubmit={handleSubmit}
            error={error}
            isLoading={loading}
            submitLabel="Create Experience"
            cancelHref="/admin/experience"
          >
            <FormGrid>
              <FormInput
                label="Company"
                value={formData.company}
                onChange={(value) => setFormData({ ...formData, company: value })}
                placeholder="e.g., Acme Corp"
                required
              />

              <FormInput
                label="Position"
                value={formData.position}
                onChange={(value) => setFormData({ ...formData, position: value })}
                placeholder="e.g., Senior Software Engineer"
                required
              />

              <FormInput
                label="Location"
                value={formData.location}
                onChange={(value) => setFormData({ ...formData, location: value })}
                placeholder="e.g., San Francisco, CA"
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
              placeholder="Brief overview of your role..."
              rows={3}
            />

            <ArrayInput
              label="Technologies"
              value={formData.technologies}
              onChange={(value) => setFormData({ ...formData, technologies: value })}
              placeholder="e.g., React, TypeScript"
              required
              hint="At least one technology is required"
              variant="chips"
            />

            <ArrayInput
              label="Responsibilities"
              value={formData.responsibilities}
              onChange={(value) => setFormData({ ...formData, responsibilities: value })}
              placeholder="e.g., Led team of 5 engineers"
              variant="list"
            />

            <ArrayInput
              label="Achievements"
              value={formData.achievements}
              onChange={(value) => setFormData({ ...formData, achievements: value })}
              placeholder="e.g., Reduced deployment time by 60%"
              variant="list"
            />
          </FormLayout>
        </main>
      </div>
    </div>
  );
}
