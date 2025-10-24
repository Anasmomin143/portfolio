'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PageHeader, FormLayout, FormGrid, FormInput, FormSelect, FormNumber } from '@/components/admin';

const CATEGORIES = [
  { value: 'frontend', label: 'Frontend' },
  { value: 'backend', label: 'Backend' },
  { value: 'database', label: 'Database' },
  { value: 'devops', label: 'DevOps' },
  { value: 'tools', label: 'Tools' },
  { value: 'other', label: 'Other' },
];

const PROFICIENCY_LEVELS = [
  { value: '1', label: '1 - Beginner' },
  { value: '2', label: '2 - Novice' },
  { value: '3', label: '3 - Intermediate' },
  { value: '4', label: '4 - Advanced' },
  { value: '5', label: '5 - Expert' },
];

export default function NewSkillPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    category: '',
    skill_name: '',
    proficiency_level: '3',
    years_experience: 0,
    display_order: 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/skills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          proficiency_level: parseInt(formData.proficiency_level),
          years_experience: formData.years_experience || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to create skill');
      }

      router.push('/admin/skills');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setLoading(false);
    }
  };

  return (
    <div>
          <PageHeader
            title="Add New Skill"
            backHref="/admin/skills"
            backLabel="Back to Skills"
          />

          <FormLayout
            onSubmit={handleSubmit}
            error={error}
            isLoading={loading}
            submitLabel="Create Skill"
            cancelHref="/admin/skills"
          >
            <FormGrid>
              <FormSelect
                label="Category"
                value={formData.category}
                onChange={(value) => setFormData({ ...formData, category: value })}
                options={CATEGORIES}
                placeholder="Select a category"
                required
              />

              <FormInput
                label="Skill Name"
                value={formData.skill_name}
                onChange={(value) => setFormData({ ...formData, skill_name: value })}
                placeholder="e.g., React, TypeScript, Docker"
                required
              />

              <FormSelect
                label="Proficiency Level"
                value={formData.proficiency_level}
                onChange={(value) => setFormData({ ...formData, proficiency_level: value })}
                options={PROFICIENCY_LEVELS}
                required
              />

              <FormNumber
                label="Years of Experience"
                value={formData.years_experience}
                onChange={(value) => setFormData({ ...formData, years_experience: value })}
                min={0}
                max={50}
                step={0.5}
                hint="Optional - can include decimals"
              />

              <FormNumber
                label="Display Order"
                value={formData.display_order}
                onChange={(value) => setFormData({ ...formData, display_order: value })}
                min={0}
                hint="Lower numbers appear first"
              />
            </FormGrid>
          </FormLayout>
    </div>
  );
}
