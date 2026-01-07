import { StudentPreference, TeacherRestriction } from '@/types/student';

export function parseStudentPreferences(csvContent: string): StudentPreference[] {
  const lines = csvContent.trim().split('\n');
  const preferences: StudentPreference[] = [];
  
  // Skip header if present
  const startIndex = lines[0].toLowerCase().includes('student') || 
                     lines[0].toLowerCase().includes('name') ? 1 : 0;
  
  for (let i = startIndex; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    // Handle both comma and semicolon delimiters
    const parts = line.includes(';') ? line.split(';') : line.split(',');
    
    if (parts.length >= 2) {
      const student = parts[0].trim().replace(/"/g, '');
      const preferredPartner = parts[1].trim().replace(/"/g, '');
      
      if (student && preferredPartner) {
        preferences.push({ student, preferredPartner });
      }
    }
  }
  
  return preferences;
}

export function parseTeacherRestrictions(csvContent: string): TeacherRestriction[] {
  const lines = csvContent.trim().split('\n');
  const restrictions: TeacherRestriction[] = [];
  
  // Skip header if present
  const startIndex = lines[0].toLowerCase().includes('student') || 
                     lines[0].toLowerCase().includes('name') ? 1 : 0;
  
  for (let i = startIndex; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    // Handle both comma and semicolon delimiters
    const parts = line.includes(';') ? line.split(';') : line.split(',');
    
    if (parts.length >= 2) {
      const student = parts[0].trim().replace(/"/g, '');
      const restrictedPartner = parts[1].trim().replace(/"/g, '');
      
      if (student && restrictedPartner) {
        restrictions.push({ student, restrictedPartner });
      }
    }
  }
  
  return restrictions;
}

export function getAllStudents(preferences: StudentPreference[]): string[] {
  const studentSet = new Set<string>();
  
  preferences.forEach(pref => {
    studentSet.add(pref.student);
    studentSet.add(pref.preferredPartner);
  });
  
  return Array.from(studentSet).sort();
}
