import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Download } from "lucide-react";
import { ComparisonChart } from "./ComparisonChart";
import { toast } from "sonner";
import { motion } from "framer-motion";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { ComparisonCard } from "./ComparisonCard";

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
      className="space-y-6 w-full bg-white p-8 rounded-lg shadow-sm"
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
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Resultados da Análise Completa</h2>
        <Button
          onClick={handleDownload}
          variant="outline"
          className="flex items-center gap-2 border-gray-300 hover:bg-gray-50"
        >
          <Download className="h-4 w-4" />
          Baixar Relatório
        </Button>
      </div>

      <div id="results-content" className="space-y-6">
        <p className="text-gray-600">
          Análise baseada nos dados fornecidos por você
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ComparisonCard
            title="Cenário Atual"
            humanValue={results.currentRevenue}
            aiValue={formData.currentCost}
            prefix="R$ "
          />
          <ComparisonCard
            title="Com IA"
            humanValue={results.aiRevenue}
            aiValue={results.aiCost}
            prefix="R$ "
          />
        </div>

        <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
          <ComparisonChart data={results.comparisonData} />
        </motion.div>

        <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
          <Card className="p-6 bg-white border border-green-200 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Insights Adicionais</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-4">
                <h4 className="font-medium text-gray-700">Impacto Financeiro</h4>
                <div>
                  <p className="text-2xl font-bold text-green-600">{Math.round(results.roi)}%</p>
                  <p className="text-sm text-gray-600">Retorno sobre investimento</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-600">{results.paybackPeriod} meses</p>
                  <p className="text-sm text-gray-600">Tempo de retorno do investimento</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-medium text-gray-700">Benefícios Operacionais</h4>
                <div>
                  <p className="text-2xl font-bold text-blue-600">24/7</p>
                  <p className="text-sm text-gray-600">Atendimento contínuo</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-600">-70%</p>
                  <p className="text-sm text-gray-600">Redução no tempo de resposta</p>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium text-gray-700">Eficiência e Produtividade</h4>
                <div>
                  <p className="text-2xl font-bold text-blue-600">+{results.additionalLeadsPerYear}</p>
                  <p className="text-sm text-gray-600">Leads adicionais por ano</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-600">
                    R$ {Math.round(results.profitPerLead).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600">Lucro adicional por lead</p>
                </div>
              </div>
            </div>
          </Card>
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
            className="bg-green-600 hover:bg-green-700 text-white text-lg px-8 py-6"
            onClick={() => window.open('#', '_blank')}
          >
            Agendar Demonstração
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
};