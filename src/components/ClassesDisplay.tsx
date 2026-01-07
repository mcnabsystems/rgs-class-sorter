import { ClassGroup } from '@/types/student';
import { Users } from 'lucide-react';

interface ClassesDisplayProps {
  classes: ClassGroup[];
}

export function ClassesDisplay({ classes }: ClassesDisplayProps) {
  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <div className="flex items-center gap-2 p-4 border-b border-border">
        <Users className="w-5 h-5 text-primary" />
        <h3 className="font-semibold text-foreground">Class Assignments</h3>
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
          {classes.length} classes
        </span>
      </div>
      <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
        {classes.map(cls => (
          <div 
            key={cls.id} 
            className="bg-muted/30 rounded-lg p-4 border border-border animate-fade-in"
            style={{ animationDelay: `${cls.id * 50}ms` }}
          >
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-foreground">Class {cls.id}</h4>
              <span className="text-xs text-muted-foreground">
                {cls.students.length} students
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {cls.students.map(student => (
                <span
                  key={student}
                  className="px-2 py-1 bg-card text-xs rounded-md border border-border"
                >
                  {student}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
