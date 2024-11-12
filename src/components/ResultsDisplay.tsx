import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Download } from "lucide-react";
import { ComparisonChart } from "./ComparisonChart";
import { toast } from "sonner";

interface ResultsDisplayProps {
  results: any | null;
}

export const ResultsDisplay = ({ results }: ResultsDisplayProps) => {
  if (!results) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-lg text-gray-500">
          Preencha o formulário e clique em "Executar Análise" para ver os resultados
        </p>
      </div>
    );
  }

  const handleDownload = () => {
    // Implementação do download seria aqui
    toast.success("Relatório baixado com sucesso!");
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Resultados da Análise</h2>
        <Button
          onClick={handleDownload}
          variant="outline"
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          Baixar Relatório
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">Custo Mensal</h3>
          <div className="text-3xl font-bold text-primary">
            R$ {results.aiCost.toLocaleString()}
          </div>
          <p className="text-sm text-gray-500 mt-1">com IA</p>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">Economia Anual</h3>
          <div className="text-3xl font-bold text-secondary">
            R$ {results.annualSavings.toLocaleString()}
          </div>
          <p className="text-sm text-gray-500 mt-1">potencial</p>
        </Card>
      </div>

      <ComparisonChart data={results.comparisonData} />

      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Principais Benefícios</h3>
        <ul className="space-y-2">
          <li className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-primary" />
            <span>Redução de {results.costReduction}% nos custos operacionais</span>
          </li>
          <li className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-secondary" />
            <span>Aumento de {results.efficiencyGain}% na eficiência</span>
          </li>
        </ul>
      </div>
    </div>
  );
};