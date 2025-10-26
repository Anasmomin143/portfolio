import { Plus, Upload, LucideIcon } from 'lucide-react';

interface ActionButton {
  href: string;
  label: string;
  icon?: LucideIcon;
  variant?: 'primary' | 'secondary';
}

export interface PageHeaderConfig {
  title: string;
  description?: string;
  backHref?: string;
  backLabel?: string;
  action?: {
    href: string;
    label: string;
    icon?: React.ReactNode;
  };
  actions?: ActionButton[];
}

export function getPageHeaderConfig(pathname: string, userName?: string): PageHeaderConfig | null {
  // Dashboard
  if (pathname === '/admin') {
    return {
      title: `Welcome back${userName ? `, ${userName}` : ''}!`,
      description: "Here's an overview of your portfolio data",
    };
  }

  // Projects
  if (pathname === '/admin/projects') {
    return {
      title: 'Projects',
      description: 'Manage your portfolio projects',
      actions: [
        {
          href: '/admin/projects/import',
          label: 'Import JSON',
          icon: Upload,
          variant: 'secondary',
        },
        {
          href: '/admin/projects/new',
          label: 'Add Project',
          icon: Plus,
          variant: 'primary',
        },
      ],
    };
  }

  if (pathname === '/admin/projects/new') {
    return {
      title: 'Add New Project',
      backHref: '/admin/projects',
      backLabel: 'Back to Projects',
    };
  }

  if (pathname === '/admin/projects/import') {
    return {
      title: 'Import Projects from JSON',
      description: 'Upload a JSON file or paste JSON data to bulk import projects',
      backHref: '/admin/projects',
      backLabel: 'Back to Projects',
    };
  }

  if (pathname.startsWith('/admin/projects/') && pathname !== '/admin/projects/new' && pathname !== '/admin/projects/import') {
    return {
      title: 'Edit Project',
      backHref: '/admin/projects',
      backLabel: 'Back to Projects',
    };
  }

  // Experience
  if (pathname === '/admin/experience') {
    return {
      title: 'Experience',
      description: 'Manage your work experience',
      action: {
        href: '/admin/experience/new',
        label: 'Add Experience',
      },
    };
  }

  if (pathname === '/admin/experience/new') {
    return {
      title: 'Add New Experience',
      backHref: '/admin/experience',
      backLabel: 'Back to Experience',
    };
  }

  if (pathname.startsWith('/admin/experience/') && pathname !== '/admin/experience/new') {
    return {
      title: 'Edit Experience',
      backHref: '/admin/experience',
      backLabel: 'Back to Experience',
    };
  }

  // Skills
  if (pathname === '/admin/skills') {
    return {
      title: 'Skills',
      description: 'Manage your technical skills and proficiency levels',
      action: {
        href: '/admin/skills/new',
        label: 'Add Skill',
      },
    };
  }

  if (pathname === '/admin/skills/new') {
    return {
      title: 'Add New Skill',
      backHref: '/admin/skills',
      backLabel: 'Back to Skills',
    };
  }

  if (pathname.startsWith('/admin/skills/') && pathname !== '/admin/skills/new') {
    return {
      title: 'Edit Skill',
      backHref: '/admin/skills',
      backLabel: 'Back to Skills',
    };
  }

  // Certifications
  if (pathname === '/admin/certifications') {
    return {
      title: 'Certifications',
      description: 'Manage your professional certifications and credentials',
      action: {
        href: '/admin/certifications/new',
        label: 'Add Certification',
      },
    };
  }

  if (pathname === '/admin/certifications/new') {
    return {
      title: 'Add New Certification',
      backHref: '/admin/certifications',
      backLabel: 'Back to Certifications',
    };
  }

  if (pathname.startsWith('/admin/certifications/') && pathname !== '/admin/certifications/new') {
    return {
      title: 'Edit Certification',
      backHref: '/admin/certifications',
      backLabel: 'Back to Certifications',
    };
  }

  // Login page or other pages without header
  return null;
}
