import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

const studentSampleCSV = `Chooser,Chosen
Alice Johnson,Bob Smith
Bob Smith,Alice Johnson
Charlie Brown,Diana Ross
Diana Ross,Charlie Brown
Emma Wilson,Frank Miller
Frank Miller,Grace Lee
Grace Lee,Henry Chen
Henry Chen,Isabella Garcia
Isabella Garcia,Jack Taylor
Jack Taylor,Katie Adams
Katie Adams,Liam Brown
Liam Brown,Mia Davis
Mia Davis,Noah Wilson
Noah Wilson,Olivia Martin
Olivia Martin,Peter Jones
Peter Jones,Quinn Roberts
Quinn Roberts,Rachel White
Rachel White,Samuel Green
Samuel Green,Tina Black
Tina Black,Uma Patel
Uma Patel,Victor Chang
Victor Chang,Uma Patel
Wendy Liu,Xavier Martinez
Xavier Martinez,Wendy Liu
Yolanda Kim,Zach Thompson
Zach Thompson,Yolanda Kim
Aaron Mitchell,Bella Cooper
Bella Cooper,Aaron Mitchell
Carlos Diaz,Danielle Foster
Danielle Foster,Ethan Gray
Ethan Gray,Fiona Hughes
Fiona Hughes,George Irving
George Irving,Hannah James
Hannah James,Ivan Kelly
Ivan Kelly,Julia Long
Julia Long,Kevin Moore
Kevin Moore,Laura Nelson
Laura Nelson,Marcus Oliver
Marcus Oliver,Nina Perry`;

const teacherSampleCSV = `Student,Forbidden Partner
Alice Johnson,Charlie Brown
Emma Wilson,Grace Lee
Jack Taylor,Liam Brown
Olivia Martin,Quinn Roberts
Victor Chang,Xavier Martinez`;

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

export function SampleDownloads() {
  return (
    <div className="flex flex-col sm:flex-row gap-3 items-center justify-center p-4 bg-muted/30 rounded-lg border border-border">
      <span className="text-sm text-muted-foreground">Need sample files?</span>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => downloadCSV(studentSampleCSV, 'student_preferences_sample.csv')}
          className="flex items-center gap-2"
        >
          <Download className="w-3.5 h-3.5" />
          Student Template
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => downloadCSV(teacherSampleCSV, 'teacher_restrictions_sample.csv')}
          className="flex items-center gap-2"
        >
          <Download className="w-3.5 h-3.5" />
          Teacher Template
        </Button>
      </div>
    </div>
  );
}
