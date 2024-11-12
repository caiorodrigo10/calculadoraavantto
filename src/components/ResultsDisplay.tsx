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
                <span className="font-bold text-primary">
                  R$ {(formData.monthlyLeads * formData.leadValue).toLocaleString()}
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
                <span className="font-bold">
                  R$ {((formData.monthlyLeads * formData.leadValue) - formData.currentCost).toLocaleString()}
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
                <span className="font-bold text-primary">
                  R$ {(formData.monthlyLeads * formData.leadValue * 1.35).toLocaleString()}
                </span>
              </p>
              <p className="flex justify-between">
                <span>Custo Mensal:</span>
                <span className="font-bold text-[#ff6b00]">
                  R$ {results.aiCost.toLocaleString()}
                </span>
              </p>
              <p className="flex justify-between border-t pt-2">
                <span>Resultado Líquido:</span>
                <span className="font-bold">
                  R$ {((formData.monthlyLeads * formData.leadValue * 1.35) - results.aiCost).toLocaleString()}
                </span>
              </p>
            </div>
          </Card>
        </motion.div>
      </div>

      <motion.div variants={item}>
        <ComparisonChart data={results.comparisonData} />
      </motion.div>

      <motion.div variants={item} className="bg-white/5 p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Principais Benefícios</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <p className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#ff6b00]" />
              <span>Redução de {results.costReduction}% nos custos</span>
            </p>
            <p className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-primary" />
              <span>Aumento de {results.efficiencyGain}% na eficiência</span>
            </p>
          </div>
          <div className="space-y-2">
            <p className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-secondary" />
              <span>Taxa de resposta {Math.round(formData.responseRate * 1.35)}%</span>
            </p>
            <p className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-accent" />
              <span>Taxa de agendamento {Math.round(formData.meetingRate * 1.35)}%</span>
            </p>
          </div>
        </div>
      </motion.div>

      <motion.div 
        variants={item}
        className="text-center p-6 bg-[#ff6b00]/10 rounded-lg"
      >
        <p className="text-lg font-medium">
          Experimente os benefícios da IA em seus processos!
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          Economia anual projetada: R$ {results.annualSavings.toLocaleString()}
        </p>
      </motion.div>
    </motion.div>
  );
};