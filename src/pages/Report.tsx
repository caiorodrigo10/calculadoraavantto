import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ResultsDisplay } from "@/components/ResultsDisplay";
import { Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const Report = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const { data: submission } = await supabase
          .from('roi_submissions')
          .select('*')
          .eq('id', id)
          .single();

        if (submission) {
          setData(submission);
        }
      } catch (error) {
        console.error('Error fetching report:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchReport();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-xl text-gray-600 mb-4">Relatório não encontrado</p>
        <Button onClick={() => navigate('/dashboard')}>Voltar para Dashboard</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <Button
          variant="outline"
          onClick={() => navigate('/dashboard')}
          className="mb-6 flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para Dashboard
        </Button>

        <ResultsDisplay
          results={data.calculated_results}
          formData={{
            monthlyLeads: data.monthly_leads,
            responseRate: data.response_rate,
            meetingRate: data.meeting_rate,
            currentCost: data.current_cost,
            leadValue: data.lead_value,
            meetingsToClose: data.meetings_to_close,
          }}
        />
      </div>
    </div>
  );
};

export default Report;