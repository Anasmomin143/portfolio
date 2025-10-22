'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  AdminSidebar,
  PageHeader,
  FormLayout,
  FormGrid,
  FormInput,
  FormTextarea,
  ArrayInput,
  FormCheckbox,
  FormDate,
  FormNumber,
  FormUrl,
} from '@/components/admin';

export default function NewProjectPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    id: '',
    name: '',
    company: '',
    description: '',
    start_date: '',
    end_date: '',
    current: false,
    technologies: [] as string[],
    highlights: [] as string[],
    demo_url: '',
    github_url: '',
    display_order: 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          end_date: formData.current ? null : formData.end_date || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to create project');
      }

      router.push('/admin/projects');
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
            title="Add New Project"
            backHref="/admin/projects"
            backLabel="Back to Projects"
          />

          <FormLayout
            onSubmit={handleSubmit}
            error={error}
            isLoading={loading}
            submitLabel="Create Project"
            cancelHref="/admin/projects"
          >
            <FormGrid>
              <FormInput
                label="Project ID"
                value={formData.id}
                onChange={(value) => setFormData({ ...formData, id: value.toLowerCase().replace(/\s+/g, '-') })}
                placeholder="e.g., my-awesome-project"
                hint="Unique identifier (auto-formatted)"
                required
              />

              <FormInput
                label="Project Name"
                value={formData.name}
                onChange={(value) => setFormData({ ...formData, name: value })}
                placeholder="e.g., E-commerce Platform"
                required
              />

              <FormInput
                label="Company/Client"
                value={formData.company}
                onChange={(value) => setFormData({ ...formData, company: value })}
                placeholder="e.g., Acme Corp"
                required
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

              <FormUrl
                label="Demo URL"
                value={formData.demo_url}
                onChange={(value) => setFormData({ ...formData, demo_url: value })}
                placeholder="https://demo.example.com"
              />

              <FormUrl
                label="GitHub URL"
                value={formData.github_url}
                onChange={(value) => setFormData({ ...formData, github_url: value })}
                placeholder="https://github.com/user/repo"
              />
            </FormGrid>

            <FormCheckbox
              label="This is a current/ongoing project"
              checked={formData.current}
              onChange={(checked) =>
                setFormData({
                  ...formData,
                  current: checked,
                  end_date: checked ? '' : formData.end_date,
                })
              }
              description="Check this if the project is still in progress"
            />

            <FormTextarea
              label="Description"
              value={formData.description}
              onChange={(value) => setFormData({ ...formData, description: value })}
              placeholder="Describe the project, your role, and key achievements..."
              rows={4}
              required
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
              label="Highlights"
              value={formData.highlights}
              onChange={(value) => setFormData({ ...formData, highlights: value })}
              placeholder="e.g., Increased user engagement by 50%"
              variant="list"
            />
          </FormLayout>
        </main>
      </div>
    </div>
  );
}
