import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { ResultsDisplay } from "@/components/ResultsDisplay";
import { InsightsSection } from "@/components/results/InsightsSection";

interface FormData {
  monthlyLeads: number;
  responseRate: number;
  meetingRate: number;
  currentCost: number;
  leadValue: number;
  meetingsToClose: number;
}

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

  const formData: FormData = {
    monthlyLeads: submission.monthly_leads,
    responseRate: submission.response_rate,
    meetingRate: submission.meeting_rate,
    currentCost: submission.current_cost,
    leadValue: submission.lead_value,
    meetingsToClose: submission.meetings_to_close,
  };

  const calculatedResults = submission.calculated_results as {
    roi: number;
    paybackPeriod: number;
    additionalLeadsPerYear: number;
    profitPerLead: number;
    aiCost: number;
    aiRevenue: number;
    currentRevenue: number;
    comparisonData: any[];
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">ROI Report</h1>
      <ResultsDisplay results={calculatedResults} formData={formData} />
      <InsightsSection 
        roi={calculatedResults.roi}
        paybackPeriod={calculatedResults.paybackPeriod}
        additionalLeadsPerYear={calculatedResults.additionalLeadsPerYear}
        profitPerLead={calculatedResults.profitPerLead}
      />
    </div>
  );
};

export default Report;