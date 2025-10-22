import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import Link from 'next/link';

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: {
    label: string;
    href: string;
  };
  icon?: React.ReactNode;
}

export function EmptyState({ title, description, action, icon }: EmptyStateProps) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center p-12 text-center">
        {icon && <div className="mb-4 text-muted-foreground">{icon}</div>}

        <h3 className="text-lg font-semibold mb-2">{title}</h3>

        {description && (
          <p className="text-muted-foreground mb-6 max-w-sm">{description}</p>
        )}

        {action && (
          <Link href={action.href}>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              {action.label}
            </Button>
          </Link>
        )}
      </CardContent>
    </Card>
  );
}
