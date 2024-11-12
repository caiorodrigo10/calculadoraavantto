import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { ComparisonChart } from "@/components/ComparisonChart";
import { ComparisonCard } from "@/components/ComparisonCard";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { toast } from "sonner";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const Report = () => {
  const { id } = useParams<{ id: string }>();

  const { data: submission, isLoading, error } = useQuery({
    queryKey: ['submission', id],
    queryFn: async () => {
      if (!id) throw new Error('No ID provided');
      
      const { data, error } = await supabase
        .from('roi_submissions')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!id, // Only run query if we have an ID
  });

  const handleDownload = async () => {
    try {
      const element = document.getElementById('report-content');
      if (!element) return;

      const canvas = await html2canvas(element, {
        scale: 2,
        logging: false,
        useCORS: true,
        allowTaint: true
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('relatorio-roi-ia.pdf');

      toast.success("Relatório baixado com sucesso!");
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error("Erro ao gerar o relatório. Tente novamente.");
    }
  };

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

  const comparisonData = [
    {
      name: "Custo Mensal",
      humano: submission.current_cost,
      ia: 997,
    },
    {
      name: "Leads Qualificados",
      humano: submission.monthly_leads * (submission.response_rate / 100),
      ia: submission.monthly_leads * ((submission.response_rate * 1.35) / 100),
    },
    {
      name: "Reuniões Agendadas",
      humano: submission.monthly_leads * (submission.meeting_rate / 100),
      ia: submission.monthly_leads * ((submission.meeting_rate * 1.35) / 100),
    },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto p-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Relatório de ROI - Análise Personalizada
          </h1>
          <p className="text-gray-600">
            Relatório gerado para {submission.first_name} {submission.last_name}
          </p>
        </div>
        <Button
          onClick={handleDownload}
          variant="outline"
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          Baixar PDF
        </Button>
      </div>

      <div id="report-content" className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ComparisonCard
            title="Custo Mensal"
            humanValue={submission.current_cost}
            aiValue={997}
            prefix="R$ "
          />
          <ComparisonCard
            title="Taxa de Resposta"
            humanValue={`${submission.response_rate}%`}
            aiValue={`${Math.round(submission.response_rate * 1.35)}%`}
          />
          <ComparisonCard
            title="Taxa de Agendamento"
            humanValue={`${submission.meeting_rate}%`}
            aiValue={`${Math.round(submission.meeting_rate * 1.35)}%`}
          />
        </div>

        <ComparisonChart data={comparisonData} />

        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-green-800 mb-4">
            Insights Adicionais
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-green-600 mb-1">Economia Anual</p>
              <p className="text-2xl font-bold text-green-700">
                R$ {((submission.current_cost - 997) * 12).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-green-600 mb-1">ROI Projetado</p>
              <p className="text-2xl font-bold text-green-700">
                {Math.round(((submission.current_cost - 997) / 997) * 100)}%
              </p>
            </div>
            <div>
              <p className="text-sm text-green-600 mb-1">Leads Adicionais/Ano</p>
              <p className="text-2xl font-bold text-green-700">
                {Math.round(submission.monthly_leads * 0.35 * 12).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Report;