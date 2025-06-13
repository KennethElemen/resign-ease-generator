
import { useState } from "react";
import { ResignationForm } from "@/components/ResignationForm";
import { LetterDisplay } from "@/components/LetterDisplay";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export interface ResignationData {
  fullName: string;
  jobTitle: string;
  companyName: string;
  lastWorkingDay: Date | undefined;
  reasonForResignation: string;
  additionalMessage: string;
}

const Index = () => {
  const [resignationData, setResignationData] = useState<ResignationData>({
    fullName: "",
    jobTitle: "",
    companyName: "",
    lastWorkingDay: undefined,
    reasonForResignation: "",
    additionalMessage: "",
  });

  const [generatedLetter, setGeneratedLetter] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-2">
            Professional Resignation Letter Generator
          </h1>
          <p className="text-slate-600 text-lg">
            Create a polished resignation letter with AI assistance
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          <Card className="p-6 shadow-lg border-0 bg-white/70 backdrop-blur-sm">
            <h2 className="text-2xl font-semibold mb-6 text-slate-800">
              Letter Details
            </h2>
            <ResignationForm
              data={resignationData}
              onDataChange={setResignationData}
              onGenerate={setGeneratedLetter}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
              error={error}
              setError={setError}
            />
          </Card>

          <Card className="p-6 shadow-lg border-0 bg-white/70 backdrop-blur-sm">
            <h2 className="text-2xl font-semibold mb-6 text-slate-800">
              Generated Letter
            </h2>
            <LetterDisplay
              letter={generatedLetter}
              isLoading={isLoading}
              data={resignationData}
            />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
