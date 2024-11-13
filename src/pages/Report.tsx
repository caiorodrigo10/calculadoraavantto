import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Mail, MessageCircle } from "lucide-react";
import { ResultsDisplay } from "@/components/ResultsDisplay";
import { InsightsSection } from "@/components/results/InsightsSection";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Helmet } from "react-helmet-async";

interface CalculatedResults {
  roi: number;
  paybackPeriod: number;
  additionalLeadsPerYear: number;
  profitPerLead: number;
  aiCost: number;
  aiRevenue: number;
  currentRevenue: number;
  comparisonData: any[];
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
        <p className="text-lg">Relatório não encontrado</p>
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

  const calculatedResults = submission.calculated_results as unknown as CalculatedResults;

  const handleShareEmail = () => {
    const subject = `Análise ROI - SDR Humanos vs IA`;
    const body = `Confira a análise de ROI para ${submission.first_name} ${submission.last_name}`;
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const handleShareWhatsApp = () => {
    const text = `Confira a análise de ROI para ${submission.first_name} ${submission.last_name}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const formattedDate = format(new Date(submission.created_at), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });

  return (
    <>
      <Helmet>
        <title>Avantto | Relatório ROI {submission?.first_name} {submission?.last_name}</title>
        <meta name="description" content={`Análise detalhada de ROI para ${submission?.first_name} ${submission?.last_name} comparando SDRs humanos e IA.`} />
      </Helmet>
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-6 sm:py-12">
          <div className="max-w-[95%] sm:max-w-[85%] mx-auto space-y-6 sm:space-y-8">
            <header className="space-y-4 sm:space-y-6 text-center">
              <div className="space-y-2">
                <h1 className="text-2xl sm:text-4xl font-bold text-gray-900">
                  SDR Humano vs IA Avantto
                </h1>
                <p className="text-base sm:text-lg text-gray-600">
                  Relatório gerado para {submission.first_name} {submission.last_name} em {formattedDate}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
                <Button
                  variant="outline"
                  onClick={handleShareEmail}
                  className="flex items-center justify-center gap-2 w-full sm:w-auto"
                >
                  <Mail className="h-4 w-4" />
                  Compartilhar por Email
                </Button>
                <Button
                  onClick={handleShareWhatsApp}
                  className="flex items-center justify-center gap-2 w-full sm:w-auto bg-[#25D366] hover:bg-[#128C7E] text-white"
                >
                  <MessageCircle className="h-4 w-4" />
                  Compartilhar por WhatsApp
                </Button>
              </div>
            </header>

            <div className="space-y-6 sm:space-y-12">
              <section className="bg-white rounded-lg p-4 sm:p-8">
                <ResultsDisplay results={calculatedResults} formData={formData} />
              </section>

              <section className="bg-white rounded-lg p-4 sm:p-8">
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
    </>
  );
};

export default Report;
