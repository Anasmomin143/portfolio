'use client';

import { useState, useEffect } from 'react';
import { COMMON_INLINE_STYLES, THEME_GRADIENTS } from '@/lib/constants/styles';
import { FolderGit2, Briefcase, Layers, Award, TrendingUp, Clock } from 'lucide-react';
import Link from 'next/link';

interface Activity {
  id: string;
  action: string;
  entity_type: string;
  table_name: string;
  details: string;
  created_at: string;
  admin_users?: {
    email: string;
  };
}

interface DashboardStats {
  projectsCount: number;
  experienceCount: number;
  skillsCount: number;
  certificationsCount: number;
  recentActivity: Activity[];
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    projectsCount: 0,
    experienceCount: 0,
    skillsCount: 0,
    certificationsCount: 0,
    recentActivity: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/admin/dashboard-stats');
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      name: 'Projects',
      value: stats.projectsCount,
      icon: FolderGit2,
      href: '/admin/projects',
      color: 'var(--color-primary)',
    },
    {
      name: 'Experience',
      value: stats.experienceCount,
      icon: Briefcase,
      href: '/admin/experience',
      color: 'var(--color-accent)',
    },
    {
      name: 'Skills',
      value: stats.skillsCount,
      icon: Layers,
      href: '/admin/skills',
      color: 'var(--color-secondary)',
    },
    {
      name: 'Certifications',
      value: stats.certificationsCount,
      icon: Award,
      href: '/admin/certifications',
      color: 'var(--color-primary)',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-12rem)]">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: 'var(--color-primary)' }} />
          <p className="text-sm" style={COMMON_INLINE_STYLES.textMuted}>
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.name}
              href={stat.href}
              className="rounded-xl p-6 transition-all duration-300 hover:scale-[1.02] card-hover"
              style={{
                background: THEME_GRADIENTS.card,
                border: '1px solid var(--card-border)',
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className="flex items-center justify-center w-12 h-12 rounded-lg"
                  style={{
                    background: `${stat.color}20`,
                  }}
                >
                  <Icon className="w-6 h-6" style={{ color: stat.color }} />
                </div>
                <TrendingUp className="w-5 h-5" style={{ color: stat.color }} />
              </div>
              <div>
                <p className="text-3xl font-bold mb-1" style={COMMON_INLINE_STYLES.text}>
                  {stat.value}
                </p>
                <p className="text-sm" style={COMMON_INLINE_STYLES.textMuted}>
                  {stat.name}
                </p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div
        className="rounded-xl p-6"
        style={{
          background: THEME_GRADIENTS.card,
          border: '1px solid var(--card-border)',
        }}
      >
        <div className="flex items-center gap-2 mb-6">
          <Clock className="w-5 h-5" style={{ color: 'var(--color-primary)' }} />
          <h2 className="text-xl font-bold" style={COMMON_INLINE_STYLES.text}>
            Recent Activity
          </h2>
        </div>

        {stats.recentActivity.length > 0 ? (
          <div className="space-y-4">
            {stats.recentActivity.map((activity: Activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-4 p-4 rounded-lg"
                style={{ background: 'var(--color-background)' }}
              >
                <div
                  className="flex items-center justify-center w-8 h-8 rounded-full flex-shrink-0"
                  style={{
                    background:
                      activity.action === 'CREATE'
                        ? 'rgba(34, 197, 94, 0.2)'
                        : activity.action === 'UPDATE'
                        ? 'rgba(59, 130, 246, 0.2)'
                        : 'rgba(239, 68, 68, 0.2)',
                  }}
                >
                  <span
                    className="text-xs font-bold"
                    style={{
                      color:
                        activity.action === 'CREATE'
                          ? '#22c55e'
                          : activity.action === 'UPDATE'
                          ? '#3b82f6'
                          : '#ef4444',
                    }}
                  >
                    {activity.action[0]}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium mb-1" style={COMMON_INLINE_STYLES.text}>
                    {activity.action} on {activity.table_name}
                  </p>
                  <p className="text-xs" style={COMMON_INLINE_STYLES.textMuted}>
                    {new Date(activity.created_at).toLocaleString()} by {activity.admin_users?.email || 'System'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center py-8" style={COMMON_INLINE_STYLES.textMuted}>
            No recent activity
          </p>
        )}
      </div>


    </div>
  );
}
