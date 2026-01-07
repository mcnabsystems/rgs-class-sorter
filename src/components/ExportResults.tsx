import { SortingResult } from '@/types/student';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ExportResultsProps {
  result: SortingResult;
}

function downloadCSV(content: string, filename: string) {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function ExportResults({ result }: ExportResultsProps) {
  const exportClassAssignments = () => {
    let csv = 'Student,Class\n';
    result.classes.forEach(cls => {
      cls.students.forEach(student => {
        csv += `"${student}",${cls.id}\n`;
      });
    });
    downloadCSV(csv, 'class_assignments.csv');
  };

  const exportDetailedClasses = () => {
    let csv = 'Class,Students\n';
    result.classes.forEach(cls => {
      const studentList = cls.students.map(s => s).join('; ');
      csv += `${cls.id},"${studentList}"\n`;
    });
    downloadCSV(csv, 'class_rosters.csv');
  };

  const exportSuccessfulPairings = () => {
    let csv = 'Student,Paired With\n';
    result.successfulPairings.forEach(pair => {
      csv += `"${pair.student}","${pair.partner}"\n`;
    });
    downloadCSV(csv, 'successful_pairings.csv');
  };

  const exportUnsuccessfulPairings = () => {
    let csv = 'Student,Requested Partner\n';
    result.unsuccessfulPairings.forEach(pair => {
      csv += `"${pair.student}","${pair.requestedPartner}"\n`;
    });
    downloadCSV(csv, 'unsuccessful_pairings.csv');
  };

  const exportFullReport = () => {
    let csv = '=== CLASS SORTING REPORT ===\n\n';
    
    // Stats
    csv += 'STATISTICS\n';
    csv += `Total Students,${result.stats.totalStudents}\n`;
    csv += `Number of Classes,${result.stats.numberOfClasses}\n`;
    csv += `Successful Pairings,${result.stats.successfulPairingsCount} (${result.stats.successfulPairingsPercentage}%)\n`;
    csv += `Unsuccessful Pairings,${result.stats.unsuccessfulPairingsCount} (${result.stats.unsuccessfulPairingsPercentage}%)\n`;
    csv += `Violated Restrictions,${result.stats.violatedRestrictionsCount}\n`;
    csv += `Restrictions Satisfied,${result.stats.satisfiedRestrictionsPercentage}%\n`;
    csv += `Overall Score,${result.stats.overallScore}%\n\n`;
    
    // Class assignments
    csv += 'CLASS ASSIGNMENTS\n';
    csv += 'Student,Class\n';
    result.classes.forEach(cls => {
      cls.students.forEach(student => {
        csv += `"${student}",${cls.id}\n`;
      });
    });
    csv += '\n';
    
    // Successful pairings
    csv += 'SUCCESSFUL PAIRINGS\n';
    csv += 'Student,Paired With\n';
    result.successfulPairings.forEach(pair => {
      csv += `"${pair.student}","${pair.partner}"\n`;
    });
    csv += '\n';
    
    // Unsuccessful pairings
    csv += 'UNSUCCESSFUL PAIRINGS\n';
    csv += 'Student,Requested Partner\n';
    result.unsuccessfulPairings.forEach(pair => {
      csv += `"${pair.student}","${pair.requestedPartner}"\n`;
    });
    csv += '\n';
    
    // Violated restrictions
    if (result.violatedRestrictions.length > 0) {
      csv += 'VIOLATED RESTRICTIONS\n';
      csv += 'Student,Placed With\n';
      result.violatedRestrictions.forEach(v => {
        csv += `"${v.student}","${v.pairedWith}"\n`;
      });
    }
    
    downloadCSV(csv, 'full_sorting_report.csv');
  };

  return (
    <div className="bg-card rounded-xl border border-border p-4">
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-sm font-medium text-foreground">Export Results:</span>
        <Button
          variant="outline"
          size="sm"
          onClick={exportClassAssignments}
          className="flex items-center gap-2"
        >
          <Download className="w-3.5 h-3.5" />
          Class Assignments
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={exportDetailedClasses}
          className="flex items-center gap-2"
        >
          <Download className="w-3.5 h-3.5" />
          Class Rosters
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={exportSuccessfulPairings}
          className="flex items-center gap-2"
        >
          <Download className="w-3.5 h-3.5" />
          Successful Pairings
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={exportUnsuccessfulPairings}
          className="flex items-center gap-2"
        >
          <Download className="w-3.5 h-3.5" />
          Unsuccessful Pairings
        </Button>
        <Button
          size="sm"
          onClick={exportFullReport}
          className="flex items-center gap-2"
        >
          <Download className="w-3.5 h-3.5" />
          Full Report
        </Button>
      </div>
    </div>
  );
}
