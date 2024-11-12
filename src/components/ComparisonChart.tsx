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
  const monthlySavings = 5000 - 997;
  const annualSavings = monthlySavings * 12;

  return (
    <div className="w-full space-y-8">
      <h3 className="text-lg font-semibold mb-4">Comparativo de Desempenho</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {data.map((item) => (
          <div key={item.name} className="bg-white/50 backdrop-blur-sm p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all">
            <h4 className="text-lg font-medium mb-4 text-gray-800">{item.name}</h4>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-700 bg-gray-100/80 px-2 py-1 rounded">Humano</span>
                <span className="text-xl font-bold text-red-500">
                  {item.name === "Custo Mensal" 
                    ? `R$ ${item.humano.toLocaleString()}`
                    : Math.round(item.humano).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700 bg-gray-100/80 px-2 py-1 rounded">IA</span>
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

      <Card className="p-6 bg-green-50/80 backdrop-blur-sm border-green-200 shadow-sm hover:shadow-md transition-all">
        <h4 className="text-xl font-semibold text-green-800 mb-2">Economia Anual Projetada</h4>
        <p className="text-3xl font-bold text-green-600">
          R$ {annualSavings.toLocaleString()}
        </p>
        <p className="text-sm text-green-700 mt-2">
          Valor estimado de economia ao substituir agendadores humanos por IA
        </p>
      </Card>

      <RevenueTrendChart />
    </div>
  );
};