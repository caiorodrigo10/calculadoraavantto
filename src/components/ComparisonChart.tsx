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

  return (
    <div className="w-full space-y-8">
      <h3 className="text-xl font-semibold text-gray-800 mb-6">Comparativo de Desempenho</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {data.map((item) => (
          <Card key={item.name} className="p-6 bg-white border-gray-100 shadow-sm">
            <h4 className="text-lg font-medium mb-4 text-gray-800">{item.name}</h4>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                <span className="text-gray-700">Humano</span>
                <span className="text-xl font-bold text-red-600">
                  {item.name === "Custo Mensal" 
                    ? `R$ ${item.humano.toLocaleString()}`
                    : Math.round(item.humano).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <span className="text-gray-700">IA</span>
                <span className="text-xl font-bold text-green-600">
                  {item.name === "Custo Mensal"
                    ? `R$ ${item.ia.toLocaleString()}`
                    : Math.round(item.ia).toLocaleString()}
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-6 bg-gradient-to-r from-green-50 to-green-100 border-green-200 shadow-sm">
        <h4 className="text-xl font-semibold text-green-800 mb-2">Economia Anual Projetada</h4>
        <p className="text-3xl font-bold text-green-600">
          R$ {annualSavings.toLocaleString()}
        </p>
        <p className="text-sm text-green-700 mt-2">
          Valor estimado de economia ao substituir agendadores humanos por IA
        </p>
      </Card>

      <div className="mt-8 mb-8">
        <RevenueTrendChart />
      </div>
    </div>
  );
};