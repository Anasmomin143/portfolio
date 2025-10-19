'use client';

import { useState, useEffect } from 'react';
import type { ResumeData, Experience, Project, TechnicalSkills, Certification } from '@/types/resume';

export function useResumeData() {
  const [data, setData] = useState<ResumeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchResumeData() {
      try {
        const response = await fetch('/api/resume');
        if (!response.ok) {
          throw new Error('Failed to fetch resume data');
        }
        const resumeData = await response.json();
        setData(resumeData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchResumeData();
  }, []);

  return { data, loading, error };
}

export function useExperience() {
  const [data, setData] = useState<Experience[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchExperience() {
      try {
        const response = await fetch('/api/resume/experience');
        if (!response.ok) {
          throw new Error('Failed to fetch experience data');
        }
        const experienceData = await response.json();
        setData(experienceData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchExperience();
  }, []);

  return { data, loading, error };
}

export function useProjects() {
  const [data, setData] = useState<Project[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const response = await fetch('/api/resume/projects');
        if (!response.ok) {
          throw new Error('Failed to fetch projects data');
        }
        const projectsData = await response.json();
        setData(projectsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, []);

  return { data, loading, error };
}

export function useSkills() {
  const [data, setData] = useState<TechnicalSkills | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSkills() {
      try {
        const response = await fetch('/api/resume/skills');
        if (!response.ok) {
          throw new Error('Failed to fetch skills data');
        }
        const skillsData = await response.json();
        setData(skillsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchSkills();
  }, []);

  return { data, loading, error };
}

export function useCertifications() {
  const [data, setData] = useState<Certification[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCertifications() {
      try {
        const response = await fetch('/api/resume/certifications');
        if (!response.ok) {
          throw new Error('Failed to fetch certifications data');
        }
        const certificationsData = await response.json();
        setData(certificationsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchCertifications();
  }, []);

  return { data, loading, error };
}
