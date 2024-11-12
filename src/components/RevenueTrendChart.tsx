import { ChartContainer } from "@/components/ui/chart";
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { Card } from "./ui/card";

interface RevenueTrendChartProps {
  currentRevenue: number;
  aiRevenue: number;
}

export const RevenueTrendChart = ({ currentRevenue, aiRevenue }: RevenueTrendChartProps) => {
  // Generate monthly data with 5% growth rate
  const generateMonthlyData = () => {
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const growthRate = 1.05; // 5% monthly growth
    
    return months.map((month, index) => ({
      month,
      current: Math.round(currentRevenue * Math.pow(growthRate, index)),
      ai: Math.round(aiRevenue * Math.pow(growthRate, index))
    }));
  };

  const data = generateMonthlyData();

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-6 text-gray-800">Tendência de Receita Anual</h3>
      <div className="h-[300px]">
        <ChartContainer
          className="w-full"
          config={{
            current: { color: "#ef4444" },
            ai: { color: "#22c55e" }
          }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart 
              data={data}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="currentGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="aiGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22c55e" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
              </defs>
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
                tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-white p-2 border border-gray-200 rounded-lg shadow-lg">
                        {payload.map((entry: any) => (
                          <div key={entry.name} className="text-sm">
                            <span className="font-medium">
                              {entry.name === "current" ? "Cenário Atual: " : "Com IA: "}
                            </span>
                            <span>
                              {new Intl.NumberFormat('pt-BR', {
                                style: 'currency',
                                currency: 'BRL'
                              }).format(entry.value)}
                            </span>
                          </div>
                        ))}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="current"
                stroke="#ef4444"
                fill="url(#currentGradient)"
                strokeWidth={2}
                name="Cenário Atual"
              />
              <Area
                type="monotone"
                dataKey="ai"
                stroke="#22c55e"
                fill="url(#aiGradient)"
                strokeWidth={2}
                name="Com IA"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </Card>
  );
};