import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ResultsDisplay } from "@/components/ResultsDisplay";
import { Skeleton } from "@/components/ui/skeleton";

const Report = () => {
  const { id } = useParams();

  const { data: submission, isLoading, error } = useQuery({
    queryKey: ['submission', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('roi_submissions')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="w-full max-w-7xl mx-auto p-4 space-y-4">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-[600px] w-full" />
      </div>
    );
  }

  if (error || !submission) {
    return (
      <div className="w-full max-w-7xl mx-auto p-4">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-red-600">Erro ao carregar relatório</h1>
          <p className="text-gray-600">Não foi possível encontrar o relatório solicitado.</p>
        </div>
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

  return (
    <div className="w-full max-w-7xl mx-auto p-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Relatório de ROI - Análise Personalizada
        </h1>
        <p className="text-gray-600">
          Relatório gerado para {submission.first_name} {submission.last_name}
        </p>
      </div>
      <ResultsDisplay 
        results={submission.calculated_results} 
        formData={formData}
      />
    </div>
  );
};

export default Report;