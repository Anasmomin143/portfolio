'use client';

import { useState, useEffect } from 'react';
import { PageHeader, DataCard, EditAction, DeleteAction, EmptyState } from '@/components/admin';
import { Badge } from '@/components/ui/badge';
import { Award, Plus } from 'lucide-react';
import { useDeleteConfirmation } from '@/hooks/use-delete-confirmation';

interface Skill {
  id: string;
  category: string;
  skill_name: string;
  proficiency_level: number;
  years_experience: number | null;
  display_order: number;
}

export default function SkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const handleDeleteSkill = async (id: string) => {
    const res = await fetch(`/api/admin/skills/${id}`, {
      method: 'DELETE',
    });

    if (!res.ok) throw new Error('Failed to delete skill');

    setSkills(skills.filter((s) => s.id !== id));
  };

  const { openDialog, ConfirmationDialog } = useDeleteConfirmation({
    onDelete: handleDeleteSkill,
    entityName: 'skill',
  });

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const res = await fetch('/api/admin/skills');
        if (!res.ok) throw new Error('Failed to fetch skills');
        const data = await res.json();
        setSkills(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, []);

  // Group skills by category
  const groupedSkills = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-12rem)]">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
          <p className="text-sm text-muted-foreground">
            Loading skills...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Skills"
        description="Manage your technical skills and proficiency levels"
        actions={[
          {
            href: '/admin/skills/new',
            label: 'Add Skill',
            icon: Plus,
            variant: 'primary',
          },
        ]}
      />

          {error && (
            <div className="mb-6 p-4 rounded-lg bg-destructive/10 text-destructive">
              {error}
            </div>
          )}

          {skills.length === 0 ? (
            <EmptyState
              title="No skills yet"
              description="Get started by adding your first skill"
              action={{
                label: 'Add Skill',
                href: '/admin/skills/new',
              }}
              icon={<Award className="h-16 w-16" />}
            />
          ) : (
            <div className="space-y-8">
              {Object.entries(groupedSkills).map(([category, categorySkills]) => (
                <div key={category}>
                  <h2 className="text-xl font-bold mb-4 capitalize">{category}</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categorySkills
                      .sort((a, b) => a.display_order - b.display_order)
                      .map((skill) => (
                        <DataCard
                          key={skill.id}
                          actions={[
                            EditAction({ href: `/admin/skills/${skill.id}` }),
                            DeleteAction({ onDelete: () => openDialog({ id: skill.id, name: skill.skill_name }) }),
                          ]}
                        >
                          <div className="space-y-2">
                            <h3 className="font-semibold text-lg">{skill.skill_name}</h3>
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary">
                                Level {skill.proficiency_level}/5
                              </Badge>
                              {skill.years_experience && (
                                <Badge variant="outline">
                                  {skill.years_experience}+ years
                                </Badge>
                              )}
                            </div>
                          </div>
                        </DataCard>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          )}

      <ConfirmationDialog />
    </div>
  );
}
