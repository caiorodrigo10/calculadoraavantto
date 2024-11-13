import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Mail, Share2 } from "lucide-react";
import { ResultsDisplay } from "@/components/ResultsDisplay";
import { InsightsSection } from "@/components/results/InsightsSection";
import { Button } from "@/components/ui/button";

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

  const formData = {
    monthlyLeads: submission.monthly_leads,
    responseRate: submission.response_rate,
    meetingRate: submission.meeting_rate,
    currentCost: submission.current_cost,
    leadValue: submission.lead_value,
    meetingsToClose: submission.meetings_to_close,
  };

  const calculatedResults = submission.calculated_results;

  const handleShareEmail = () => {
    const subject = `Análise ROI - SDR Humanos vs IA`;
    const body = `Confira a análise de ROI para ${submission.first_name} ${submission.last_name}`;
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const handleShareWhatsApp = () => {
    const text = `Confira a análise de ROI para ${submission.first_name} ${submission.last_name}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto py-12">
        <div className="max-w-[50%] mx-auto space-y-8">
          <header className="space-y-4">
            <h1 className="text-4xl font-bold text-gray-900">
              Calculadora de Lucro para {submission.first_name} {submission.last_name}
            </h1>
            <p className="text-xl text-gray-600">
              SDR Humanos vs IA
            </p>
            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={handleShareEmail}
                className="flex items-center gap-2"
              >
                <Mail className="h-4 w-4" />
                Compartilhar por Email
              </Button>
              <Button
                variant="outline"
                onClick={handleShareWhatsApp}
                className="flex items-center gap-2"
              >
                <Share2 className="h-4 w-4" />
                Compartilhar por WhatsApp
              </Button>
            </div>
          </header>

          <div className="space-y-12">
            <section className="bg-card rounded-lg p-8 shadow-sm">
              <ResultsDisplay results={calculatedResults} formData={formData} />
            </section>

            <section className="bg-card rounded-lg p-8 shadow-sm">
              <InsightsSection 
                roi={calculatedResults.roi}
                paybackPeriod={calculatedResults.paybackPeriod}
                additionalLeadsPerYear={calculatedResults.additionalLeadsPerYear}
                profitPerLead={calculatedResults.profitPerLead}
              />
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Report;