import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Save, AlertCircle } from 'lucide-react';
import Link from 'next/link';

interface FormLayoutProps {
  children: React.ReactNode;
  onSubmit: (e: React.FormEvent) => void;
  title?: string;
  error?: string;
  isLoading?: boolean;
  submitLabel?: string;
  cancelHref?: string;
  cancelLabel?: string;
}

export function FormLayout({
  children,
  onSubmit,
  title,
  error,
  isLoading,
  submitLabel = 'Save',
  cancelHref,
  cancelLabel = 'Cancel',
}: FormLayoutProps) {
  return (
    <form onSubmit={onSubmit} className="max-w-4xl space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card variant="static">
        {title && (
          <CardHeader>
            <CardTitle>{title}</CardTitle>
          </CardHeader>
        )}
        <CardContent className="space-y-6 pt-6">{children}</CardContent>
      </Card>

      <div className="flex gap-4">
        <Button type="submit" disabled={isLoading}>
          <Save className="mr-2 h-4 w-4" />
          {isLoading ? 'Saving...' : submitLabel}
        </Button>

        {cancelHref && (
          <Link href={cancelHref}>
            <Button type="button" variant="outline">
              {cancelLabel}
            </Button>
          </Link>
        )}
      </div>
    </form>
  );
}

// Grid layout for form fields
export function FormGrid({ children, cols = 2 }: { children: React.ReactNode; cols?: 1 | 2 }) {
  return (
    <div className={`grid grid-cols-1 ${cols === 2 ? 'md:grid-cols-2' : ''} gap-6`}>
      {children}
    </div>
  );
}
