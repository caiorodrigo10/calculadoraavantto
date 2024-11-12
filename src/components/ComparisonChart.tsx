import { ChartContainer } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";

interface ComparisonChartProps {
  data: {
    name: string;
    humano: number;
    ia: number;
  }[];
}

const monthlyData = [
  { month: 'Jan', humano: 5000, ia: 997 },
  { month: 'Fev', humano: 5000, ia: 997 },
  { month: 'Mar', humano: 5000, ia: 997 },
  { month: 'Abr', humano: 5000, ia: 997 },
  { month: 'Mai', humano: 5000, ia: 997 },
  { month: 'Jun', humano: 5000, ia: 997 },
  { month: 'Jul', humano: 5000, ia: 997 },
  { month: 'Ago', humano: 5000, ia: 997 },
  { month: 'Set', humano: 5000, ia: 997 },
  { month: 'Out', humano: 5000, ia: 997 },
  { month: 'Nov', humano: 5000, ia: 997 },
  { month: 'Dez', humano: 5000, ia: 997 },
];

export const ComparisonChart = ({ data }: ComparisonChartProps) => {
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
                <span className="text-muted-foreground">Humano</span>
                <span className="text-xl font-bold text-destructive">
                  {item.name === "Custo Mensal" 
                    ? `R$ ${item.humano.toLocaleString()}`
                    : Math.round(item.humano).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">IA</span>
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

      {/* Gráfico de Custo Mensal */}
      <div className="mt-8">
        <h4 className="text-lg font-medium mb-4">Comparativo de Custo Mensal</h4>
        <div className="w-full h-[400px]">
          <ChartContainer
            className="w-full"
            config={{
              humano: { color: "#ef4444" },
              ia: { color: "#22c55e" }
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData} barGap={8}>
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
                  tickFormatter={(value) => `R$ ${value}`}
                />
                <Bar
                  dataKey="humano"
                  name="Humano"
                  fill="var(--color-humano)"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="ia"
                  name="IA"
                  fill="var(--color-ia)"
                  radius={[4, 4, 0, 0]}
                />
                <Tooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-background p-2 border border-border rounded-lg shadow-lg">
                          {payload.map((entry) => (
                            <div key={entry.name} className="text-sm">
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
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </div>
    </div>
  );
};