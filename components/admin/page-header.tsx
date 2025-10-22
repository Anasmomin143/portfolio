import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Plus } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  description?: string;
  backHref?: string;
  backLabel?: string;
  action?: {
    href: string;
    label: string;
    icon?: React.ReactNode;
  };
}

export function PageHeader({
  title,
  description,
  backHref,
  backLabel = 'Back',
  action,
}: PageHeaderProps) {
  return (
    <div className="mb-8">
      {backHref && (
        <Link
          href={backHref}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          {backLabel}
        </Link>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          {description && (
            <p className="text-lg text-muted-foreground mt-2">{description}</p>
          )}
        </div>

        {action && (
          <Link href={action.href}>
            <Button>
              {action.icon || <Plus className="mr-2 h-4 w-4" />}
              {action.label}
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}
