import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";

interface ComparisonChartProps {
  data: {
    name: string;
    humano: number;
    ia: number;
  }[];
}

export const ComparisonChart = ({ data }: ComparisonChartProps) => {
  const charts = [
    { title: "Custo Mensal", dataKey: "Custo Mensal" },
    { title: "Leads Qualificados", dataKey: "Leads Qualificados" },
    { title: "Reuniões Agendadas", dataKey: "Reuniões Agendadas" }
  ];

  return (
    <div className="w-full space-y-4">
      <h3 className="text-lg font-semibold mb-4">Comparativo de Desempenho</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {data.map((item, index) => (
          <div key={item.name} className="w-full h-[300px]">
            <p className="text-sm font-medium mb-2">{item.name}</p>
            <ChartContainer
              className="w-full"
              config={{
                humano: { color: "#ef4444" },
                ia: { color: "#22c55e" }
              }}
            >
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={[item]} barGap={8}>
                  <XAxis dataKey="name" hide />
                  <YAxis />
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
                                <span>{entry.value}</span>
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
        ))}
      </div>
    </div>
  );
};