import { Card } from "./ui/card";
import { RevenueTrendChart } from "./RevenueTrendChart";

interface ComparisonChartProps {
  data: {
    name: string;
    humano: number;
    ia: number;
  }[];
}

export const ComparisonChart = ({ data }: ComparisonChartProps) => {
  // Calculate annual savings
  const monthlySavings = 5000 - 997; // Difference between human and AI cost
  const annualSavings = monthlySavings * 12;

  // Find the revenue values from the data array
  const revenueData = data.find(item => item.name === "Custo Mensal");
  const currentRevenue = revenueData?.humano || 0;
  const aiRevenue = revenueData?.ia || 0;

  return (
    <div className="w-full space-y-8">
      <h3 className="text-lg font-semibold mb-4">Comparativo de Desempenho</h3>
      
      {/* Números em Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {data.map((item) => (
          <div key={item.name} className="bg-card p-6 rounded-lg border border-border">
            <h4 className="text-lg font-medium mb-4 text-foreground">{item.name}</h4>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-foreground bg-background/80 px-2 py-1 rounded">Humano</span>
                <span className="text-xl font-bold text-destructive">
                  {item.name === "Custo Mensal" 
                    ? `R$ ${item.humano.toLocaleString()}`
                    : Math.round(item.humano).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-foreground bg-background/80 px-2 py-1 rounded">IA</span>
                <span className="text-xl font-bold text-green-500">
                  {item.name === "Custo Mensal"
                    ? `R$ ${item.ia.toLocaleString()}`
                    : Math.round(item.ia).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Card de Economia Anual */}
      <Card className="p-6 bg-green-50 border-green-200">
        <h4 className="text-xl font-semibold text-green-800 mb-2">Economia Anual Projetada</h4>
        <p className="text-3xl font-bold text-green-600">
          R$ {annualSavings.toLocaleString()}
        </p>
        <p className="text-sm text-green-700 mt-2">
          Valor estimado de economia ao substituir agendadores humanos por IA
        </p>
      </Card>

      {/* Gráfico de Tendências em uma nova linha */}
      <div className="w-full mt-8">
        <RevenueTrendChart 
          currentRevenue={currentRevenue}
          aiRevenue={aiRevenue}
        />
      </div>
    </div>
  );
};