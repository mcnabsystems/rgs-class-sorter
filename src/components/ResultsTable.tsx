import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

interface ResultsTableProps {
  title: string;
  icon: 'success' | 'error' | 'warning';
  data: { student: string; partner?: string; requestedPartner?: string; pairedWith?: string }[];
  columns: { key: string; label: string }[];
}

export function ResultsTable({ title, icon, data, columns }: ResultsTableProps) {
  const iconMap = {
    success: <CheckCircle className="w-5 h-5 text-success" />,
    error: <XCircle className="w-5 h-5 text-destructive" />,
    warning: <AlertTriangle className="w-5 h-5 text-warning" />
  };

  const badgeClass = {
    success: 'success-badge',
    error: 'error-badge',
    warning: 'warning-badge'
  };

  if (data.length === 0) {
    return (
      <div className="bg-card rounded-xl border border-border p-6">
        <div className="flex items-center gap-2 mb-4">
          {iconMap[icon]}
          <h3 className="section-header mb-0">{title}</h3>
          <span className={badgeClass[icon]}>{data.length}</span>
        </div>
        <p className="text-muted-foreground text-sm text-center py-4">
          No records to display
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <div className="flex items-center gap-2 p-4 border-b border-border">
        {iconMap[icon]}
        <h3 className="font-semibold text-foreground">{title}</h3>
        <span className={badgeClass[icon]}>{data.length}</span>
      </div>
      <div className="overflow-x-auto max-h-64 overflow-y-auto">
        <table className="data-table">
          <thead className="sticky top-0 bg-card">
            <tr>
              {columns.map(col => (
                <th key={col.key}>{col.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr key={idx} className="animate-fade-in" style={{ animationDelay: `${idx * 20}ms` }}>
                {columns.map(col => (
                  <td key={col.key}>{(row as any)[col.key]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
