import { useState, useRef, useEffect } from 'react';
import { X, ChevronDown, Search, Star } from 'lucide-react';

interface StudentSelectorProps {
  students: string[];
  selectedStudents: string[];
  onChange: (students: string[]) => void;
}

export function StudentSelector({ students, selectedStudents, onChange }: StudentSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredStudents = students.filter(student =>
    student.toLowerCase().includes(search.toLowerCase())
  );

  const toggleStudent = (student: string) => {
    if (selectedStudents.includes(student)) {
      onChange(selectedStudents.filter(s => s !== student));
    } else {
      onChange([...selectedStudents, student]);
    }
  };

  const removeStudent = (student: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(selectedStudents.filter(s => s !== student));
  };

  return (
    <div className="flex flex-col gap-3">
      <label className="text-sm font-medium text-foreground flex items-center gap-2">
        <Star className="w-4 h-4 text-warning" />
        Priority Students
      </label>
      
      <div ref={containerRef} className="relative">
        <div
          onClick={() => setIsOpen(!isOpen)}
          className="min-h-[44px] px-3 py-2 border border-border rounded-lg bg-card cursor-pointer flex items-center gap-2 flex-wrap"
        >
          {selectedStudents.length === 0 ? (
            <span className="text-muted-foreground text-sm">
              Select students to prioritize...
            </span>
          ) : (
            selectedStudents.map(student => (
              <span
                key={student}
                className="inline-flex items-center gap-1 px-2 py-1 bg-warning/10 text-warning rounded-md text-sm font-medium"
              >
                {student}
                <button
                  onClick={(e) => removeStudent(student, e)}
                  className="hover:bg-warning/20 rounded p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))
          )}
          <ChevronDown className={`w-4 h-4 text-muted-foreground ml-auto transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </div>

        {isOpen && (
          <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-popover border border-border rounded-lg shadow-lg max-h-64 overflow-hidden">
            <div className="p-2 border-b border-border">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search students..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>
            <div className="overflow-y-auto max-h-48">
              {filteredStudents.length === 0 ? (
                <p className="p-3 text-sm text-muted-foreground text-center">
                  No students found
                </p>
              ) : (
                filteredStudents.map(student => (
                  <button
                    key={student}
                    onClick={() => toggleStudent(student)}
                    className={`w-full px-3 py-2 text-left text-sm hover:bg-muted/50 flex items-center gap-2 ${
                      selectedStudents.includes(student) ? 'bg-primary/5 text-primary' : ''
                    }`}
                  >
                    <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                      selectedStudents.includes(student) 
                        ? 'bg-primary border-primary' 
                        : 'border-border'
                    }`}>
                      {selectedStudents.includes(student) && (
                        <svg className="w-3 h-3 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    {student}
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>
      
      <p className="text-xs text-muted-foreground">
        Selected students will have their pairing requests guaranteed in the next run
      </p>
    </div>
  );
}
