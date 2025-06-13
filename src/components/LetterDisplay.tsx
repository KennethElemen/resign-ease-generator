
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Download, FileText, Loader2 } from "lucide-react";
import { ResignationData } from "@/pages/Index";
import { toast } from "@/hooks/use-toast";
import html2pdf from "html2pdf.js";

interface LetterDisplayProps {
  letter: string;
  isLoading: boolean;
  data: ResignationData;
}

export const LetterDisplay = ({ letter, isLoading, data }: LetterDisplayProps) => {
  const downloadPDF = () => {
    if (!letter) {
      toast({
        title: "No Letter to Download",
        description: "Please generate a letter first before downloading.",
        variant: "destructive",
      });
      return;
    }

    const element = document.getElementById("letter-content");
    if (!element) return;

    const opt = {
      margin: 1,
      filename: `resignation-letter-${data.fullName?.replace(/\s+/g, '-').toLowerCase() || 'document'}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save().then(() => {
      toast({
        title: "PDF Downloaded",
        description: "Your resignation letter has been downloaded successfully!",
      });
    }).catch(() => {
      toast({
        title: "Download Failed",
        description: "There was an error downloading your letter. Please try again.",
        variant: "destructive",
      });
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
        <div className="space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </div>
    );
  }

  if (!letter) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <FileText className="h-16 w-16 text-slate-300 mb-4" />
        <h3 className="text-lg font-medium text-slate-600 mb-2">
          No Letter Generated Yet
        </h3>
        <p className="text-slate-500 max-w-md">
          Fill in your details and click "Generate Letter" to create your professional resignation letter.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button
          onClick={downloadPDF}
          variant="outline"
          className="hover:bg-green-50 hover:border-green-300 hover:text-green-700 transition-all duration-200"
        >
          <Download className="mr-2 h-4 w-4" />
          Download PDF
        </Button>
      </div>

      <ScrollArea className="h-[600px] rounded-md border bg-white p-6">
        <div id="letter-content" className="space-y-4 text-sm leading-relaxed">
          <div className="whitespace-pre-wrap font-mono text-slate-800">
            {letter}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};
