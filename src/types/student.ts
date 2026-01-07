export interface StudentPreference {
  student: string;
  preferredPartner: string;
}

export interface TeacherRestriction {
  student: string;
  restrictedPartner: string;
}

export interface ClassGroup {
  id: number;
  students: string[];
}

export interface SortingResult {
  classes: ClassGroup[];
  successfulPairings: { student: string; partner: string }[];
  unsuccessfulPairings: { student: string; requestedPartner: string }[];
  violatedRestrictions: { student: string; pairedWith: string }[];
  stats: {
    totalStudents: number;
    numberOfClasses: number;
    successfulPairingsCount: number;
    successfulPairingsPercentage: number;
    unsuccessfulPairingsCount: number;
    unsuccessfulPairingsPercentage: number;
    violatedRestrictionsCount: number;
    satisfiedRestrictionsPercentage: number;
    overallScore: number;
  };
}

export type PrecedenceMode = 'student' | 'teacher';
