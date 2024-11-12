import { ChartContainer } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { Card } from "./ui/card";

interface ComparisonChartProps {
  data: {
    name: string;
    humano: number;
    ia: number;
  }[];
}

// Calculate accumulated costs for each month
const monthlyData = [
  { month: 'Jan', humano: 5000, ia: 997 },
  { month: 'Fev', humano: 10000, ia: 1994 },
  { month: 'Mar', humano: 15000, ia: 2991 },
  { month: 'Abr', humano: 20000, ia: 3988 },
  { month: 'Mai', humano: 25000, ia: 4985 },
  { month: 'Jun', humano: 30000, ia: 5982 },
  { month: 'Jul', humano: 35000, ia: 6979 },
  { month: 'Ago', humano: 40000, ia: 7976 },
  { month: 'Set', humano: 45000, ia: 8973 },
  { month: 'Out', humano: 50000, ia: 9970 },
  { month: 'Nov', humano: 55000, ia: 10967 },
  { month: 'Dez', humano: 60000, ia: 11964 },
];

export const ComparisonChart = ({ data }: ComparisonChartProps) => {
  // Calculate annual savings
  const monthlySavings = 5000 - 997; // Difference between human and AI cost
  const annualSavings = monthlySavings * 12;

  return (
    <div className="w-full space-y-8">
      <h3 className="text-lg font-semibold mb-4">Comparativo de Desempenho</h3>
      
      {/* Números em Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {data.map((item) => (
          <div key={item.name} className="bg-secondary/10 p-6 rounded-lg">
            <h4 className="text-lg font-medium mb-4">{item.name}</h4>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-foreground">Humano</span>
                <span className="text-xl font-bold text-destructive">
                  {item.name === "Custo Mensal" 
                    ? `R$ ${item.humano.toLocaleString()}`
                    : Math.round(item.humano).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-foreground">IA</span>
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

      {/* Gráfico de Custo Mensal Acumulado */}
      <div className="mt-8">
        <h4 className="text-lg font-medium mb-4">Comparativo de Custo Mensal Acumulado</h4>
        <div className="w-full h-[400px]">
          <ChartContainer
            className="w-full"
            config={{
              humano: { color: "#ef4444" },
              ia: { color: "#22c55e" }
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData}>
                <XAxis 
                  dataKey="month"
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `R$ ${value.toLocaleString()}`}
                />
                <Line
                  type="monotone"
                  dataKey="humano"
                  name="Humano"
                  stroke="#ef4444"
                  strokeWidth={2}
                  dot={false}
                  fill="url(#humanGradient)"
                />
                <Line
                  type="monotone"
                  dataKey="ia"
                  name="IA"
                  stroke="#22c55e"
                  strokeWidth={2}
                  dot={false}
                  fill="url(#iaGradient)"
                />
                <Tooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-background p-2 border border-border rounded-lg shadow-lg">
                          {payload.map((entry) => (
                            <div key={entry.name} className="text-sm text-foreground">
                              <span className="font-medium">{entry.name}: </span>
                              <span>R$ {entry.value.toLocaleString()}</span>
                            </div>
                          ))}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
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
    </div>
  );
};