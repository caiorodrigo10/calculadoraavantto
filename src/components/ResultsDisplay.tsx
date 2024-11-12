import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Download } from "lucide-react";
import { ComparisonChart } from "./ComparisonChart";
import { toast } from "sonner";
import { motion } from "framer-motion";

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
  const handleDownload = () => {
    toast.success("Relatório baixado com sucesso!");
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      className="space-y-6 w-full"
      variants={container}
      initial="hidden"
      animate="show"
    >
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Resultados da Análise Completa</h2>
        <Button
          onClick={handleDownload}
          variant="outline"
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          Baixar Relatório
        </Button>
      </div>

      <p className="text-muted-foreground">
        Análise baseada nos dados fornecidos por você
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.div variants={item}>
          <Card className="p-6 bg-white/5">
            <h3 className="text-lg font-semibold mb-2">Cenário Atual</h3>
            <div className="space-y-2">
              <p className="flex justify-between">
                <span>Receita Potencial:</span>
                <span className="font-bold text-destructive">
                  R$ {results.currentRevenue.toLocaleString()}
                </span>
              </p>
              <p className="flex justify-between">
                <span>Custo Mensal:</span>
                <span className="font-bold text-destructive">
                  R$ {formData.currentCost.toLocaleString()}
                </span>
              </p>
              <p className="flex justify-between border-t pt-2">
                <span>Resultado Líquido:</span>
                <span className="font-bold text-destructive">
                  R$ {(results.currentRevenue - formData.currentCost).toLocaleString()}
                </span>
              </p>
            </div>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="p-6 bg-white/5">
            <h3 className="text-lg font-semibold mb-2">Com IA</h3>
            <div className="space-y-2">
              <p className="flex justify-between">
                <span>Receita Projetada:</span>
                <span className="font-bold text-secondary">
                  R$ {results.aiRevenue.toLocaleString()}
                </span>
              </p>
              <p className="flex justify-between">
                <span>Custo Mensal:</span>
                <span className="font-bold text-secondary">
                  R$ {results.aiCost.toLocaleString()}
                </span>
              </p>
              <p className="flex justify-between border-t pt-2">
                <span>Resultado Líquido:</span>
                <span className="font-bold text-secondary">
                  R$ {(results.aiRevenue - results.aiCost).toLocaleString()}
                </span>
              </p>
            </div>
          </Card>
        </motion.div>
      </div>

      <motion.div variants={item}>
        <ComparisonChart data={results.comparisonData} />
      </motion.div>

      <motion.div variants={item}>
        <Card className="p-6 bg-white/5">
          <h3 className="text-lg font-semibold mb-4">Insights Adicionais</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-1">ROI do Investimento</h4>
                <p className="text-2xl font-bold text-secondary">{Math.round(results.roi)}%</p>
                <p className="text-sm text-muted-foreground">Retorno sobre o investimento</p>
              </div>
              <div>
                <h4 className="font-medium mb-1">Tempo de Retorno</h4>
                <p className="text-2xl font-bold text-secondary">{results.paybackPeriod} meses</p>
                <p className="text-sm text-muted-foreground">Para recuperar o investimento</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-1">Leads Adicionais por Ano</h4>
                <p className="text-2xl font-bold text-secondary">+{results.additionalLeadsPerYear}</p>
                <p className="text-sm text-muted-foreground">Aumento na captação anual</p>
              </div>
              <div>
                <h4 className="font-medium mb-1">Lucro Adicional por Lead</h4>
                <p className="text-2xl font-bold text-secondary">
                  R$ {Math.round(results.profitPerLead).toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground">Incremento por lead convertido</p>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      <motion.div 
        variants={item}
        className="text-center p-8 bg-secondary/10 rounded-lg"
      >
        <h3 className="text-xl font-semibold mb-2">
          Potencialize seus Resultados com IA
        </h3>
        <p className="text-lg mb-4">
          Agende uma reunião com nossos especialistas e descubra como implementar 
          essa solução em sua empresa.
        </p>
        <Button 
          className="bg-secondary hover:bg-secondary/90 text-lg px-8 py-6"
          onClick={() => window.open('#', '_blank')}
        >
          Agendar Demonstração
        </Button>
      </motion.div>
    </motion.div>
  );
};