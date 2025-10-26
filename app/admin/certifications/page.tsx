'use client';

import { useEffect } from 'react';
import { DataCard, EditAction, DeleteAction, EmptyState, DataWrapper } from '@/components/admin';
import { Badge } from '@/components/ui/badge';
import { Award } from 'lucide-react';
import { useConfirmationDialog } from '@/hooks/use-delete-confirmation';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { fetchCertifications, deleteCertification } from '@/lib/redux/slices/certificationsSlice';
import { addToast } from '@/lib/redux/slices/uiSlice';

export default function CertificationsPage() {
  const dispatch = useAppDispatch();
  const { items: certifications, loading, error } = useAppSelector((state) => state.certifications);

  useEffect(() => {
    dispatch(fetchCertifications());
  }, [dispatch]);

  const handleDeleteCertification = async (id: string) => {
    try {
      await dispatch(deleteCertification(id)).unwrap();
      dispatch(addToast({
        type: 'success',
        message: 'Certification deleted successfully',
      }));
    } catch (error) {
      dispatch(addToast({
        type: 'error',
        message: error as string,
      }));
      throw error; // Re-throw for confirmation dialog
    }
  };

  const { openDialog, ConfirmationDialog } = useConfirmationDialog({
    onConfirm: handleDeleteCertification,
    config: {
      title: 'Delete Certification?',
      description: (item) => (
        <>
          This will permanently delete <strong>&quot;{item.name} - {item.issuer}&quot;</strong>.
          This action cannot be undone.
        </>
      ),
      actionLabel: 'Delete',
      actionButtonClass: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
      successMessage: (item) => `${item.name} deleted successfully`,
      errorMessage: 'Failed to delete certification',
    }
  });

  const refetch = () => {
    dispatch(fetchCertifications());
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

  return (
    <DataWrapper
      loading={loading}
      error={error}
      onRetry={refetch}
      loadingMessage="Loading certifications..."
    >
      <div>
          {(certifications?.length || 0) === 0 ? (
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
              {[...(certifications || [])]
                .sort((a, b) => a.display_order - b.display_order)
                .map((cert) => (
                  <DataCard
                    key={cert.id}
                    actions={[
                      EditAction({ href: `/admin/certifications/${cert.id}` }),
                      DeleteAction({ onDelete: () => openDialog({
                        id: cert.id,
                        name: cert.name,
                        issuer: cert.issuer
                      }) }),
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

        <ConfirmationDialog />
      </div>
    </DataWrapper>
  );
}
