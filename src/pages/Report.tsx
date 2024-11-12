import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import ResultsDisplay from "@/components/ResultsDisplay";
import InsightsSection from "@/components/results/InsightsSection";

const Report = () => {
  const { id } = useParams();
  const { toast } = useToast();

  const { data: submission, isLoading } = useQuery({
    queryKey: ["submission", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("roi_submissions")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        toast({
          title: "Error",
          description: "Failed to load submission data",
          variant: "destructive",
        });
        throw error;
      }

      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!submission) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Submission not found</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">ROI Report</h1>
      <ResultsDisplay results={submission.calculated_results} />
      <InsightsSection results={submission.calculated_results} />
    </div>
  );
};

export default Report;