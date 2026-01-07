import { PrecedenceMode } from '@/types/student';
import { Users, GraduationCap } from 'lucide-react';

interface PrecedenceToggleProps {
  value: PrecedenceMode;
  onChange: (value: PrecedenceMode) => void;
}

export function PrecedenceToggle({ value, onChange }: PrecedenceToggleProps) {
  return (
    <div className="flex flex-col gap-3">
      <label className="text-sm font-medium text-foreground">
        Precedence Priority
      </label>
      <div className="flex rounded-lg border border-border bg-muted/50 p-1">
        <button
          onClick={() => onChange('student')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
            value === 'student'
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Users className="w-4 h-4" />
          Student Preferences
        </button>
        <button
          onClick={() => onChange('teacher')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
            value === 'teacher'
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          Teacher Restrictions
        </button>
      </div>
      <p className="text-xs text-muted-foreground">
        {value === 'student' 
          ? 'Prioritizes satisfying student pairing requests, may violate some teacher restrictions'
          : 'Strictly enforces teacher restrictions, may reduce successful student pairings'}
      </p>
    </div>
  );
}
