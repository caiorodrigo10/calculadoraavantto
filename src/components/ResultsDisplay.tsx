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
      className="space-y-6 w-full"
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h2 className="text-2xl font-bold text-white">Resultados da Análise</h2>
        <Button
          onClick={handleDownload}
          variant="outline"
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#ff6b00] hover:bg-[#ff6b00]/90 text-white"
        >
          <Download className="h-4 w-4" />
          Baixar Relatório
        </Button>
      </div>

      <div id="results-content" className="space-y-8 bg-white p-6 rounded-lg">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <ResultCard
            title="Cenário Atual"
            data={[
              { label: "Receita Potencial", value: results.currentRevenue, colorClass: "text-red-600" },
              { label: "Custo Mensal", value: formData.currentCost, colorClass: "text-red-600" },
              { label: "Resultado Líquido", value: results.currentRevenue - formData.currentCost, colorClass: "text-red-600" }
            ]}
          />

          <ResultCard
            title="Com IA"
            data={[
              { label: "Receita Potencial", value: results.aiRevenue, colorClass: "text-green-600" },
              { label: "Custo Mensal", value: results.aiCost, colorClass: "text-green-600" },
              { label: "Resultado Líquido", value: results.aiRevenue - results.aiCost, colorClass: "text-green-600" }
            ]}
          />
        </div>

        <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Comparativo de Desempenho</h3>
          <ComparisonChart data={results.comparisonData} />
        </motion.div>

        <motion.div 
          variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
          className="text-center p-8 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200"
        >
          <h3 className="text-xl font-semibold mb-2 text-gray-800">
            Potencialize seus Resultados com IA
          </h3>
          <p className="text-lg mb-4 text-gray-600">
            Agende uma reunião com nossos especialistas e descubra como implementar 
            essa solução em sua empresa.
          </p>
          <Button 
            className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white text-lg px-8 py-6"
            onClick={() => window.open('#', '_blank')}
          >
            Agendar Demonstração
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
};