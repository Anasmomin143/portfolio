'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
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
import { toast } from 'sonner';

interface ProjectFormData {
  id: string;
  name: string;
  company: string;
  description: string;
  start_date: string;
  end_date: string;
  current: boolean;
  technologies: string[];
  highlights: string[];
  demo_url: string;
  github_url: string;
  display_order: number;
}

export default function EditProjectPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState<ProjectFormData>({
    id: '',
    name: '',
    company: '',
    description: '',
    start_date: '',
    end_date: '',
    current: false,
    technologies: [],
    highlights: [],
    demo_url: '',
    github_url: '',
    display_order: 0,
  });

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await fetch(`/api/admin/projects/${projectId}`);
        if (!res.ok) throw new Error('Failed to fetch project');
        const data = await res.json();

        // Format dates for input fields
        setFormData({
          ...data,
          start_date: data.start_date ? data.start_date.split('T')[0] : '',
          end_date: data.end_date ? data.end_date.split('T')[0] : '',
          technologies: data.technologies || [],
          highlights: data.highlights || [],
          demo_url: data.demo_url || '',
          github_url: data.github_url || '',
        });
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Failed to load project');
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [projectId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch(`/api/admin/projects/${projectId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          end_date: formData.current ? null : formData.end_date || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to update project');
      }

      toast.success('Project updated successfully!');
      router.push('/admin/projects');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to update project');
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-12rem)]">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
          <p className="text-sm text-muted-foreground">
            Loading project...
          </p>
        </div>
      </div>
    );
  }

  return (
    <FormLayout
            onSubmit={handleSubmit}
            isLoading={saving}
            submitLabel="Save Changes"
            cancelHref="/admin/projects"
          >
            <FormGrid>
              <FormInput
                label="Project ID"
                value={formData.id}
                onChange={(value) => setFormData({ ...formData, id: value })}
                hint="Cannot be changed"
                disabled
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
  );
}
