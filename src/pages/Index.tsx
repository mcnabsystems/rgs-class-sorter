import { useState, useMemo } from 'react';
import { FileUpload } from '@/components/FileUpload';
import { PrecedenceToggle } from '@/components/PrecedenceToggle';
import { StudentSelector } from '@/components/StudentSelector';
import { StatsCard } from '@/components/StatsCard';
import { ResultsTable } from '@/components/ResultsTable';
import { ClassesDisplay } from '@/components/ClassesDisplay';
import { SampleDownloads } from '@/components/SampleDownloads';
import { ExportResults } from '@/components/ExportResults';
import { parseStudentPreferences, parseTeacherRestrictions, getAllStudents } from '@/utils/csvParser';
import { sortStudents } from '@/utils/sortingAlgorithm';
import { StudentPreference, TeacherRestriction, PrecedenceMode, SortingResult } from '@/types/student';
import { Users, Trophy, AlertCircle, XCircle, Shuffle, RotateCcw } from 'lucide-react';
import rgsLogo from '@/assets/rgs-logo.gif';
import { Button } from '@/components/ui/button';

const Index = () => {
  const [studentPreferences, setStudentPreferences] = useState<StudentPreference[]>([]);
  const [teacherRestrictions, setTeacherRestrictions] = useState<TeacherRestriction[]>([]);
  const [precedence, setPrecedence] = useState<PrecedenceMode>('student');
  const [prioritizedStudents, setPrioritizedStudents] = useState<string[]>([]);
  const [result, setResult] = useState<SortingResult | null>(null);

  const allStudents = useMemo(() => {
    return getAllStudents(studentPreferences);
  }, [studentPreferences]);

  const handleStudentPreferencesLoad = (content: string) => {
    const preferences = parseStudentPreferences(content);
    setStudentPreferences(preferences);
    setResult(null);
  };

  const handleTeacherRestrictionsLoad = (content: string) => {
    const restrictions = parseTeacherRestrictions(content);
    setTeacherRestrictions(restrictions);
    setResult(null);
  };

  const handleSort = () => {
    if (studentPreferences.length === 0) return;
    
    const sortingResult = sortStudents(
      studentPreferences,
      teacherRestrictions,
      precedence,
      prioritizedStudents
    );
    setResult(sortingResult);
  };

  const handleReset = () => {
    setStudentPreferences([]);
    setTeacherRestrictions([]);
    setPrecedence('student');
    setPrioritizedStudents([]);
    setResult(null);
  };

  const canSort = studentPreferences.length > 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container py-6">
          <div className="flex items-center gap-3">
            <img src={rgsLogo} alt="Ripon Grammar School Logo" className="h-12" />
            <div>
              <h1 className="text-2xl font-bold text-foreground">RGS Class Sorter</h1>
              <p className="text-sm text-muted-foreground">
                Intelligently sort students into classes based on preferences and restrictions
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="container py-8 space-y-8">
        {/* Sample Downloads */}
        <SampleDownloads />

        {/* Upload Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FileUpload
            label="Student Preferences"
            description="CSV with Chooser,Chosen columns"
            onFileLoad={handleStudentPreferencesLoad}
            isLoaded={studentPreferences.length > 0}
            recordCount={studentPreferences.length}
          />
          <FileUpload
            label="Teacher Restrictions"
            description="CSV with Student,Forbidden Partner columns"
            onFileLoad={handleTeacherRestrictionsLoad}
            isLoaded={teacherRestrictions.length > 0}
            recordCount={teacherRestrictions.length}
          />
        </section>

        {/* Controls Section */}
        {canSort && (
          <section className="bg-card rounded-xl border border-border p-6 space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <PrecedenceToggle value={precedence} onChange={setPrecedence} />
              <StudentSelector
                students={allStudents}
                selectedStudents={prioritizedStudents}
                onChange={setPrioritizedStudents}
              />
            </div>
            
            <div className="flex gap-3 pt-4 border-t border-border">
              <Button 
                onClick={handleSort}
                className="flex items-center gap-2"
                size="lg"
              >
                <Shuffle className="w-4 h-4" />
                {result ? 'Re-Sort Students' : 'Sort Students'}
              </Button>
              <Button 
                onClick={handleReset}
                variant="outline"
                size="lg"
                className="flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </Button>
            </div>
          </section>
        )}

        {/* Results Section */}
        {result && (
          <section className="space-y-6 animate-fade-in">
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatsCard
                value={result.stats.totalStudents}
                label="Total Students"
                icon={<Users className="w-5 h-5" />}
              />
              <StatsCard
                value={`${result.stats.successfulPairingsPercentage}%`}
                label="Successful Pairings"
                icon={<Trophy className="w-5 h-5" />}
                variant="success"
              />
              <StatsCard
                value={`${result.stats.satisfiedRestrictionsPercentage}%`}
                label="Restrictions Satisfied"
                icon={<AlertCircle className="w-5 h-5" />}
                variant={result.stats.violatedRestrictionsCount > 0 ? 'warning' : 'success'}
              />
              <StatsCard
                value={`${result.stats.overallScore}%`}
                label="Overall Score"
                icon={<Trophy className="w-5 h-5" />}
                variant={result.stats.overallScore >= 70 ? 'success' : result.stats.overallScore >= 50 ? 'warning' : 'destructive'}
              />
            </div>

            {/* Export Options */}
            <ExportResults result={result} />

            {/* Class Assignments */}
            <ClassesDisplay classes={result.classes} />

            {/* Detailed Results */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <ResultsTable
                title="Successful Pairings"
                icon="success"
                data={result.successfulPairings}
                columns={[
                  { key: 'student', label: 'Student' },
                  { key: 'partner', label: 'Paired With' }
                ]}
              />
              <ResultsTable
                title="Unsuccessful Requests"
                icon="error"
                data={result.unsuccessfulPairings}
                columns={[
                  { key: 'student', label: 'Student' },
                  { key: 'requestedPartner', label: 'Requested Partner' }
                ]}
              />
              <ResultsTable
                title="Violated Restrictions"
                icon="warning"
                data={result.violatedRestrictions}
                columns={[
                  { key: 'student', label: 'Student' },
                  { key: 'pairedWith', label: 'Placed With' }
                ]}
              />
            </div>
          </section>
        )}

        {/* Empty State */}
        {!canSort && (
          <section className="text-center py-16 animate-fade-in">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
              <XCircle className="w-8 h-8 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-2">
              No Data Loaded
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Upload your student preferences CSV file to get started. 
              Teacher restrictions are optional but recommended.
            </p>
          </section>
        )}
      </main>
    </div>
  );
};

export default Index;
