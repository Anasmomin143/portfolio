import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';

interface Action {
  label: string;
  href?: string;
  onClick?: () => void;
  variant?: 'default' | 'destructive' | 'outline';
  icon?: React.ReactNode;
}

interface DataCardProps {
  children: React.ReactNode;
  actions?: Action[];
  className?: string;
}

export function DataCard({ children, actions, className }: DataCardProps) {
  return (
    <Card className={`transition-all hover:shadow-md ${className || ''}`}>
      <CardContent className="p-6">
        {children}

        {actions && actions.length > 0 && (
          <div className="flex items-center gap-2 pt-4 mt-4 border-t">
            {actions.map((action, idx) => {
              const button = (
                <Button
                  key={idx}
                  variant={action.variant || 'outline'}
                  size="sm"
                  onClick={action.onClick}
                  className="gap-2"
                >
                  {action.icon}
                  {action.label}
                </Button>
              );

              return action.href ? (
                <Link key={idx} href={action.href}>
                  {button}
                </Link>
              ) : (
                button
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Convenience components for common actions
export function EditAction({ href }: { href: string }) {
  return {
    label: 'Edit',
    href,
    variant: 'outline' as const,
    icon: <Edit className="h-4 w-4" />,
  };
}

export function DeleteAction({ onDelete }: { onDelete: () => void }) {
  return {
    label: 'Delete',
    onClick: onDelete,
    variant: 'destructive' as const,
    icon: <Trash2 className="h-4 w-4" />,
  };
}
