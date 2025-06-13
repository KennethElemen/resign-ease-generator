
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Loader2, Sparkles } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { ResignationData } from "@/pages/Index";
import { toast } from "@/hooks/use-toast";

interface ResignationFormProps {
  data: ResignationData;
  onDataChange: (data: ResignationData) => void;
  onGenerate: (letter: string) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  error: string;
  setError: (error: string) => void;
}

export const ResignationForm = ({
  data,
  onDataChange,
  onGenerate,
  isLoading,
  setIsLoading,
  error,
  setError,
}: ResignationFormProps) => {
  const [apiKey, setApiKey] = useState("");

  const handleInputChange = (field: keyof ResignationData, value: any) => {
    onDataChange({ ...data, [field]: value });
  };

  const generateLetter = async () => {
    if (!apiKey.trim()) {
      setError("Please enter your Google Gemini API key");
      toast({
        title: "API Key Required",
        description: "Please enter your Google Gemini API key to generate the letter.",
        variant: "destructive",
      });
      return;
    }

    if (!data.fullName || !data.jobTitle || !data.companyName || !data.lastWorkingDay) {
      setError("Please fill in all required fields");
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields to generate the letter.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const prompt = `Generate a professional resignation letter with the following details:
      
Full Name: ${data.fullName}
Job Title: ${data.jobTitle}
Company Name: ${data.companyName}
Last Working Day: ${format(data.lastWorkingDay, "MMMM dd, yyyy")}
${data.reasonForResignation ? `Reason for Resignation: ${data.reasonForResignation}` : ""}
${data.additionalMessage ? `Additional Message: ${data.additionalMessage}` : ""}

Please create a formal, professional resignation letter that:
1. Follows proper business letter format
2. Is polite and professional in tone
3. Clearly states the resignation and last working day
4. Expresses gratitude for opportunities
5. Offers to help with transition
6. Is approximately 200-300 words

Format the letter properly with date, recipient, body paragraphs, and signature block.`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const result = await response.json();
      const generatedText = result.candidates[0]?.content?.parts[0]?.text;

      if (generatedText) {
        onGenerate(generatedText);
        toast({
          title: "Letter Generated",
          description: "Your resignation letter has been generated successfully!",
        });
      } else {
        throw new Error("No content generated");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate letter';
      setError(errorMessage);
      toast({
        title: "Generation Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="apiKey" className="text-sm font-medium text-slate-700">
          Google Gemini API Key *
        </Label>
        <Input
          id="apiKey"
          type="password"
          placeholder="Enter your Gemini API key"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          className="transition-all duration-200 focus:ring-2 focus:ring-blue-500/20"
        />
        <p className="text-xs text-slate-500">
          Get your API key from{" "}
          <a
            href="https://makersuite.google.com/app/apikey"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            Google AI Studio
          </a>
        </p>
      </div>

      <div className="grid gap-4">
        <div className="space-y-2">
          <Label htmlFor="fullName" className="text-sm font-medium text-slate-700">
            Full Name *
          </Label>
          <Input
            id="fullName"
            placeholder="Enter your full name"
            value={data.fullName}
            onChange={(e) => handleInputChange("fullName", e.target.value)}
            className="transition-all duration-200 focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="jobTitle" className="text-sm font-medium text-slate-700">
            Job Title *
          </Label>
          <Input
            id="jobTitle"
            placeholder="Enter your current job title"
            value={data.jobTitle}
            onChange={(e) => handleInputChange("jobTitle", e.target.value)}
            className="transition-all duration-200 focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="companyName" className="text-sm font-medium text-slate-700">
            Company Name *
          </Label>
          <Input
            id="companyName"
            placeholder="Enter your company name"
            value={data.companyName}
            onChange={(e) => handleInputChange("companyName", e.target.value)}
            className="transition-all duration-200 focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium text-slate-700">
            Last Working Day *
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal transition-all duration-200 hover:border-blue-300 focus:ring-2 focus:ring-blue-500/20",
                  !data.lastWorkingDay && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {data.lastWorkingDay ? (
                  format(data.lastWorkingDay, "PPP")
                ) : (
                  <span>Pick your last working day</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={data.lastWorkingDay}
                onSelect={(date) => handleInputChange("lastWorkingDay", date)}
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label htmlFor="reason" className="text-sm font-medium text-slate-700">
            Reason for Resignation (Optional)
          </Label>
          <Textarea
            id="reason"
            placeholder="Brief reason for leaving (optional)"
            value={data.reasonForResignation}
            onChange={(e) => handleInputChange("reasonForResignation", e.target.value)}
            className="min-h-[80px] transition-all duration-200 focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="message" className="text-sm font-medium text-slate-700">
            Additional Message (Optional)
          </Label>
          <Textarea
            id="message"
            placeholder="Any additional message or notes"
            value={data.additionalMessage}
            onChange={(e) => handleInputChange("additionalMessage", e.target.value)}
            className="min-h-[80px] transition-all duration-200 focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-md bg-red-50 border border-red-200">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <Button
        onClick={generateLetter}
        disabled={isLoading}
        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-md hover:shadow-lg transition-all duration-200"
        size="lg"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Generating Letter...
          </>
        ) : (
          <>
            <Sparkles className="mr-2 h-4 w-4" />
            Generate Letter
          </>
        )}
      </Button>
    </div>
  );
};
