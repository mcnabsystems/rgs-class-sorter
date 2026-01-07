import { ReactNode } from 'react';

interface StatsCardProps {
  value: string | number;
  label: string;
  icon?: ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'destructive';
}

export function StatsCard({ value, label, icon, variant = 'default' }: StatsCardProps) {
  const variantStyles = {
    default: 'text-foreground',
    success: 'text-success',
    warning: 'text-warning',
    destructive: 'text-destructive'
  };

  return (
    <div className="stat-card">
      <div className="flex items-start justify-between">
        <div>
          <p className={`stat-value ${variantStyles[variant]}`}>{value}</p>
          <p className="stat-label">{label}</p>
        </div>
        {icon && (
          <div className={`p-2 rounded-lg bg-muted ${variantStyles[variant]}`}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
