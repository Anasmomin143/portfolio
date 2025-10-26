'use client';

import { useEffect } from 'react';
import { DataCard, EditAction, DeleteAction, EmptyState, DataWrapper } from '@/components/admin';
import { Badge } from '@/components/ui/badge';
import { Award } from 'lucide-react';
import { useDeleteConfirmation } from '@/hooks/use-delete-confirmation';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { fetchSkills, deleteSkill } from '@/lib/redux/slices/skillsSlice';
import { addToast } from '@/lib/redux/slices/uiSlice';

interface Skill {
  id: string;
  category: string;
  skill_name: string;
  proficiency_level: number;
  years_experience: number | null;
  display_order: number;
}

export default function SkillsPage() {
  const dispatch = useAppDispatch();
  const { items: skills, loading, error } = useAppSelector((state) => state.skills);

  useEffect(() => {
    dispatch(fetchSkills());
  }, [dispatch]);

  const handleDeleteSkill = async (id: string) => {
    try {
      await dispatch(deleteSkill(id)).unwrap();
      dispatch(addToast({
        type: 'success',
        message: 'Skill deleted successfully',
      }));
    } catch (error) {
      dispatch(addToast({
        type: 'error',
        message: error as string,
      }));
      throw error; // Re-throw for confirmation dialog
    }
  };

  const { openDialog, ConfirmationDialog } = useDeleteConfirmation({
    onDelete: handleDeleteSkill,
    entityName: 'skill',
  });

  const refetch = () => {
    dispatch(fetchSkills());
  };

  // Group skills by category
  const groupedSkills = (skills || []).reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  return (
    <DataWrapper
      loading={loading}
      error={error}
      onRetry={refetch}
      loadingMessage="Loading skills..."
    >
      <div>
          {(skills?.length || 0) === 0 ? (
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
    </DataWrapper>
  );
}
