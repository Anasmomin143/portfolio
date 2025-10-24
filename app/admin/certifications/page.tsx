'use client';

import { useState, useEffect } from 'react';
import { PageHeader, DataCard, EditAction, DeleteAction, EmptyState } from '@/components/admin';
import { Badge } from '@/components/ui/badge';
import { Award, Plus } from 'lucide-react';

interface Certification {
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

export default function CertificationsPage() {
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCertifications = async () => {
      try {
        const res = await fetch('/api/admin/certifications');
        if (!res.ok) throw new Error('Failed to fetch certifications');
        const data = await res.json();
        setCertifications(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchCertifications();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this certification?')) return;

    try {
      const res = await fetch(`/api/admin/certifications/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Failed to delete certification');

      setCertifications(certifications.filter((c) => c.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete certification');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
    });
  };

  const isExpired = (expiryDate: string | null) => {
    if (!expiryDate) return false;
    return new Date(expiryDate) < new Date();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Certifications"
        description="Manage your professional certifications and credentials"
        actions={[
          {
            href: '/admin/certifications/new',
            label: 'Add Certification',
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

          {certifications.length === 0 ? (
            <EmptyState
              title="No certifications yet"
              description="Get started by adding your first certification"
              action={{
                label: 'Add Certification',
                href: '/admin/certifications/new',
              }}
              icon={<Award className="h-16 w-16" />}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {certifications
                .sort((a, b) => a.display_order - b.display_order)
                .map((cert) => (
                  <DataCard
                    key={cert.id}
                    actions={[
                      EditAction({ href: `/admin/certifications/${cert.id}` }),
                      DeleteAction({ onDelete: () => handleDelete(cert.id) }),
                    ]}
                  >
                    <div className="space-y-3">
                      <div>
                        <h3 className="font-semibold text-lg">{cert.name}</h3>
                        <p className="text-sm text-muted-foreground">{cert.issuer}</p>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary">
                          Issued: {formatDate(cert.issue_date)}
                        </Badge>
                        {cert.expiry_date && (
                          <Badge variant={isExpired(cert.expiry_date) ? 'destructive' : 'outline'}>
                            {isExpired(cert.expiry_date) ? 'Expired' : 'Expires'}: {formatDate(cert.expiry_date)}
                          </Badge>
                        )}
                        {!cert.expiry_date && (
                          <Badge variant="outline">No Expiry</Badge>
                        )}
                      </div>

                      {cert.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {cert.description}
                        </p>
                      )}

                      {cert.credential_id && (
                        <p className="text-xs text-muted-foreground">
                          ID: {cert.credential_id}
                        </p>
                      )}

                      {cert.credential_url && (
                        <a
                          href={cert.credential_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:underline inline-block"
                          onClick={(e) => e.stopPropagation()}
                        >
                          View Credential →
                        </a>
                      )}
                    </div>
                  </DataCard>
                ))}
            </div>
          )}
    </div>
  );
}
