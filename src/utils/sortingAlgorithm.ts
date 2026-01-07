import { 
  StudentPreference, 
  TeacherRestriction, 
  ClassGroup, 
  SortingResult,
  PrecedenceMode 
} from '@/types/student';

interface PairingGraph {
  [student: string]: {
    wants: string | null;
    wantedBy: string[];
    restricted: string[];
    restrictedBy: string[];
  };
}

function buildGraph(
  students: string[],
  preferences: StudentPreference[],
  restrictions: TeacherRestriction[]
): PairingGraph {
  const graph: PairingGraph = {};
  
  students.forEach(student => {
    graph[student] = {
      wants: null,
      wantedBy: [],
      restricted: [],
      restrictedBy: []
    };
  });
  
  preferences.forEach(pref => {
    if (graph[pref.student]) {
      graph[pref.student].wants = pref.preferredPartner;
    }
    if (graph[pref.preferredPartner]) {
      graph[pref.preferredPartner].wantedBy.push(pref.student);
    }
  });
  
  restrictions.forEach(rest => {
    if (graph[rest.student]) {
      graph[rest.student].restricted.push(rest.restrictedPartner);
    }
    if (graph[rest.restrictedPartner]) {
      graph[rest.restrictedPartner].restrictedBy.push(rest.student);
    }
  });
  
  return graph;
}

function canPair(
  student1: string,
  student2: string,
  graph: PairingGraph,
  precedence: PrecedenceMode
): { canPair: boolean; violatesRestriction: boolean } {
  const isRestricted = 
    graph[student1]?.restricted.includes(student2) ||
    graph[student2]?.restricted.includes(student1);
  
  if (precedence === 'teacher' && isRestricted) {
    return { canPair: false, violatesRestriction: false };
  }
  
  return { canPair: true, violatesRestriction: isRestricted };
}

function findMutualPairs(
  students: string[],
  graph: PairingGraph,
  precedence: PrecedenceMode,
  prioritized: Set<string>
): Map<string, string> {
  const pairs = new Map<string, string>();
  const assigned = new Set<string>();
  
  // First, handle prioritized students
  const prioritizedList = Array.from(prioritized);
  for (const student of prioritizedList) {
    if (assigned.has(student)) continue;
    
    const wanted = graph[student]?.wants;
    if (wanted && !assigned.has(wanted)) {
      const { canPair: able } = canPair(student, wanted, graph, precedence);
      // For prioritized students, we pair them even if it violates restrictions
      // (unless teacher has precedence)
      if (able || (precedence === 'student' && prioritized.has(student))) {
        pairs.set(student, wanted);
        pairs.set(wanted, student);
        assigned.add(student);
        assigned.add(wanted);
      }
    }
  }
  
  // Find mutual pairs (both chose each other)
  for (const student of students) {
    if (assigned.has(student)) continue;
    
    const wanted = graph[student]?.wants;
    if (wanted && !assigned.has(wanted)) {
      const wantedBack = graph[wanted]?.wants === student;
      if (wantedBack) {
        const { canPair: able } = canPair(student, wanted, graph, precedence);
        if (able) {
          pairs.set(student, wanted);
          pairs.set(wanted, student);
          assigned.add(student);
          assigned.add(wanted);
        }
      }
    }
  }
  
  // Then try to satisfy remaining preferences
  for (const student of students) {
    if (assigned.has(student)) continue;
    
    const wanted = graph[student]?.wants;
    if (wanted && !assigned.has(wanted)) {
      const { canPair: able } = canPair(student, wanted, graph, precedence);
      if (able) {
        pairs.set(student, wanted);
        pairs.set(wanted, student);
        assigned.add(student);
        assigned.add(wanted);
      }
    }
  }
  
  return pairs;
}

function distributeIntoClasses(
  students: string[],
  pairs: Map<string, string>,
  numClasses: number,
  graph: PairingGraph,
  precedence: PrecedenceMode
): ClassGroup[] {
  const classes: ClassGroup[] = Array.from({ length: numClasses }, (_, i) => ({
    id: i + 1,
    students: []
  }));
  
  const assigned = new Set<string>();
  const targetSize = Math.ceil(students.length / numClasses);
  
  // First, place paired students together
  const processedPairs = new Set<string>();
  pairs.forEach((partner, student) => {
    if (processedPairs.has(student) || processedPairs.has(partner)) return;
    
    // Find the smallest class that can fit both
    const availableClass = classes.find(c => c.students.length + 2 <= targetSize + 1);
    if (availableClass) {
      availableClass.students.push(student, partner);
      assigned.add(student);
      assigned.add(partner);
      processedPairs.add(student);
      processedPairs.add(partner);
    }
  });
  
  // Then distribute remaining students
  const remaining = students.filter(s => !assigned.has(s));
  
  for (const student of remaining) {
    // Find a class where this student has minimal restrictions
    let bestClass = classes[0];
    let minRestrictions = Infinity;
    
    for (const cls of classes) {
      if (cls.students.length >= targetSize + 1) continue;
      
      let restrictionCount = 0;
      for (const classmate of cls.students) {
        if (graph[student]?.restricted.includes(classmate) ||
            graph[classmate]?.restricted.includes(student)) {
          restrictionCount++;
        }
      }
      
      if (restrictionCount < minRestrictions) {
        minRestrictions = restrictionCount;
        bestClass = cls;
      }
    }
    
    bestClass.students.push(student);
    assigned.add(student);
  }
  
  return classes;
}

export function sortStudents(
  preferences: StudentPreference[],
  restrictions: TeacherRestriction[],
  precedence: PrecedenceMode,
  prioritizedStudents: string[] = [],
  numClasses?: number
): SortingResult {
  // Get all unique students
  const studentSet = new Set<string>();
  preferences.forEach(p => {
    studentSet.add(p.student);
    studentSet.add(p.preferredPartner);
  });
  const students = Array.from(studentSet);
  
  // Determine number of classes if not specified
  const classCount = numClasses || Math.max(2, Math.ceil(students.length / 25));
  
  // Build relationship graph
  const graph = buildGraph(students, preferences, restrictions);
  
  // Find optimal pairs
  const prioritizedSet = new Set(prioritizedStudents);
  const pairs = findMutualPairs(students, graph, precedence, prioritizedSet);
  
  // Distribute into classes
  const classes = distributeIntoClasses(students, pairs, classCount, graph, precedence);
  
  // Calculate results
  const successfulPairings: { student: string; partner: string }[] = [];
  const unsuccessfulPairings: { student: string; requestedPartner: string }[] = [];
  const violatedRestrictions: { student: string; pairedWith: string }[] = [];
  
  // Check each preference
  preferences.forEach(pref => {
    const studentClass = classes.find(c => c.students.includes(pref.student));
    const partnerClass = classes.find(c => c.students.includes(pref.preferredPartner));
    
    if (studentClass && partnerClass && studentClass.id === partnerClass.id) {
      successfulPairings.push({
        student: pref.student,
        partner: pref.preferredPartner
      });
    } else {
      unsuccessfulPairings.push({
        student: pref.student,
        requestedPartner: pref.preferredPartner
      });
    }
  });
  
  // Check for violated restrictions
  restrictions.forEach(rest => {
    const studentClass = classes.find(c => c.students.includes(rest.student));
    const restrictedClass = classes.find(c => c.students.includes(rest.restrictedPartner));
    
    if (studentClass && restrictedClass && studentClass.id === restrictedClass.id) {
      violatedRestrictions.push({
        student: rest.student,
        pairedWith: rest.restrictedPartner
      });
    }
  });
  
  // Calculate stats
  const totalPreferences = preferences.length;
  const totalRestrictions = restrictions.length;
  
  const successfulPairingsPercentage = totalPreferences > 0 
    ? Math.round((successfulPairings.length / totalPreferences) * 100) 
    : 0;
  
  const satisfiedRestrictionsPercentage = totalRestrictions > 0
    ? Math.round(((totalRestrictions - violatedRestrictions.length) / totalRestrictions) * 100)
    : 100;
  
  // Overall score weighted by precedence
  const overallScore = precedence === 'teacher'
    ? Math.round((satisfiedRestrictionsPercentage * 0.7) + (successfulPairingsPercentage * 0.3))
    : Math.round((successfulPairingsPercentage * 0.7) + (satisfiedRestrictionsPercentage * 0.3));
  
  return {
    classes,
    successfulPairings,
    unsuccessfulPairings,
    violatedRestrictions,
    stats: {
      totalStudents: students.length,
      numberOfClasses: classCount,
      successfulPairingsCount: successfulPairings.length,
      successfulPairingsPercentage,
      unsuccessfulPairingsCount: unsuccessfulPairings.length,
      unsuccessfulPairingsPercentage: 100 - successfulPairingsPercentage,
      violatedRestrictionsCount: violatedRestrictions.length,
      satisfiedRestrictionsPercentage,
      overallScore
    }
  };
}
