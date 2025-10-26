'use client';

import { ReactNode } from 'react';
import { LoadingState } from './loading-state';
import { ErrorState } from './error-state';

interface DataWrapperProps {
  loading: boolean;
  error: string | null;
  onRetry?: () => void;
  loadingMessage?: string;
  errorTitle?: string;
  fullHeight?: boolean;
  children: ReactNode;
}

export function DataWrapper({
  loading,
  error,
  onRetry,
  loadingMessage,
  errorTitle,
  fullHeight = true,
  children,
}: DataWrapperProps) {
  if (loading) {
    return <LoadingState message={loadingMessage} fullHeight={fullHeight} />;
  }

  if (error) {
    return (
      <ErrorState
        message={error}
        title={errorTitle}
        onRetry={onRetry}
        fullHeight={fullHeight}
      />
    );
  }

  return <>{children}</>;
}
