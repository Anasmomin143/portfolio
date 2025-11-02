import { useState, useEffect } from 'react';
import { PersonalInfo } from '@/types/resume';

export interface Project {
  id: string;
  name: string;
  company: string;
  description: string;
  start_date: string;
  end_date: string | null;
  current: boolean;
  highlights: string[];
  technologies: string[];
  demo_url: string | null;
  github_url: string | null;
  image_url: string | null;
  display_order: number;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  location: string | null;
  start_date: string;
  end_date: string | null;
  current: boolean;
  description: string | null;
  responsibilities: string[];
  technologies: string[];
  achievements: string[];
  display_order: number;
}

export interface Skill {
  id: string;
  category: string;
  skill_name: string;
  proficiency_level: number;
  years_experience: number | null;
  display_order: number;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  issue_date: string;
  expiry_date: string | null;
  credential_id: string | null;
  credential_url: string | null;
  description: string | null;
  display_order: number;
}

export interface TenantInfo {
  subdomain: string;
  name: string;
  settings: Record<string, any>;
}

export interface PortfolioData {
  tenant: TenantInfo;
  personalDetails: PersonalInfo | null;
  projects: Project[];
  experience: Experience[];
  skills: Skill[];
  certifications: Certification[];
}

interface UsePortfolioResult {
  data: PortfolioData | null;
  loading: boolean;
  error: string | null;
}

/**
 * Hook to fetch portfolio data from the current subdomain
 * Used by public portfolio pages
 */
export function usePortfolio(): UsePortfolioResult {
  const [data, setData] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        setLoading(true);
        setError(null);

        // Check if we're on a subdomain (client-side check)
        const hostname = window.location.hostname;
        const parts = hostname.split('.');

        // Check if on main domain (no subdomain)
        // localhost, 127.0.0.1, or just the main domain without subdomain
        const isMainDomain =
          hostname === 'localhost' ||
          hostname === '127.0.0.1' ||
          hostname.startsWith('localhost') ||
          parts.length < 2 || // No subdomain parts
          (parts.length === 2 && parts[0] === 'www'); // www is treated as main domain

        // Don't fetch if we're on the main domain (no subdomain)
        if (isMainDomain) {
          setLoading(false);
          return;
        }

        const response = await fetch('/api/portfolio');

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch portfolio');
        }

        const portfolioData = await response.json();
        setData(portfolioData);
      } catch (err) {
        console.error('Error fetching portfolio:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolio();
  }, []);

  return { data, loading, error };
}

/**
 * Hook to fetch only projects
 */
export function useProjects() {
  const { data, loading, error } = usePortfolio();

  return {
    data: data?.projects || null,
    loading,
    error,
  };
}

/**
 * Hook to fetch only experience
 */
export function useExperience() {
  const { data, loading, error } = usePortfolio();

  return {
    data: data?.experience || null,
    loading,
    error,
  };
}

/**
 * Hook to fetch only skills
 */
export function useSkills() {
  const { data, loading, error } = usePortfolio();

  return {
    data: data?.skills || null,
    loading,
    error,
  };
}

/**
 * Hook to fetch only certifications
 */
export function useCertifications() {
  const { data, loading, error } = usePortfolio();

  return {
    data: data?.certifications || null,
    loading,
    error,
  };
}

/**
 * Hook to fetch only personal details
 */
export function usePersonalDetails() {
  const { data, loading, error } = usePortfolio();

  return {
    data: data?.personalDetails || null,
    loading,
    error,
  };
}
