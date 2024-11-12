import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { ComparisonChart } from "./ComparisonChart";
import { toast } from "sonner";
import { motion } from "framer-motion";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { ResultCard } from "./results/ResultCard";
import { InsightsSection } from "./results/InsightsSection";

interface ResultsDisplayProps {
  results: any;
  formData: {
    monthlyLeads: number;
    responseRate: number;
    meetingRate: number;
    currentCost: number;
    leadValue: number;
    meetingsToClose: number;
  };
}

export const ResultsDisplay = ({ results, formData }: ResultsDisplayProps) => {
  const handleDownload = async () => {
    try {
      const element = document.getElementById('results-content');
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

  return (
    <motion.div 
      className="space-y-8 w-full bg-white p-6 sm:p-8 rounded-lg shadow-lg"
      initial="hidden"
      animate="show"
      variants={{
        hidden: { opacity: 0 },
        show: {
          opacity: 1,
          transition: { staggerChildren: 0.1 }
        }
      }}
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 pb-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Resultados da Análise Completa</h2>
          <p className="text-sm sm:text-base text-gray-600 mt-2">
            Análise baseada nos dados fornecidos por você
          </p>
        </div>
        <Button
          onClick={handleDownload}
          variant="outline"
          className="w-full sm:w-auto flex items-center justify-center gap-2 border-gray-300 hover:bg-gray-50"
        >
          <Download className="h-4 w-4" />
          Baixar Relatório
        </Button>
      </div>

      <div id="results-content" className="space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <ResultCard
            title="Cenário Atual"
            data={[
              { label: "Receita Potencial", value: results.currentRevenue, colorClass: "text-red-600" },
              { label: "Custo Mensal", value: formData.currentCost, colorClass: "text-red-600" },
              { label: "Resultado Líquido", value: results.currentRevenue - formData.currentCost, colorClass: "text-red-600" }
            ]}
            className="border-red-100 shadow-red-50"
          />

          <ResultCard
            title="Com IA"
            data={[
              { label: "Receita Potencial", value: results.aiRevenue, colorClass: "text-green-600" },
              { label: "Custo Mensal", value: results.aiCost, colorClass: "text-green-600" },
              { label: "Resultado Líquido", value: results.aiRevenue - results.aiCost, colorClass: "text-green-600" }
            ]}
            className="border-green-100 shadow-green-50"
          />
        </div>

        <div className="border-t border-b border-gray-100 py-8">
          <ComparisonChart data={results.comparisonData} />
        </div>

        <InsightsSection
          roi={results.roi}
          paybackPeriod={results.paybackPeriod}
          additionalLeadsPerYear={results.additionalLeadsPerYear}
          profitPerLead={results.profitPerLead}
        />

        <motion.div 
          variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
          className="text-center p-8 bg-gradient-to-b from-green-50 to-green-100 rounded-lg border border-green-200 shadow-sm"
        >
          <h3 className="text-xl sm:text-2xl font-semibold mb-3 text-green-800">
            Potencialize seus Resultados com IA
          </h3>
          <p className="text-base sm:text-lg mb-6 text-green-700">
            Agende uma reunião com nossos especialistas e descubra como implementar 
            essa solução em sua empresa.
          </p>
          <Button 
            className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white text-base sm:text-lg px-8 sm:px-10 py-6"
            onClick={() => window.open('#', '_blank')}
          >
            Agendar Demonstração
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
};