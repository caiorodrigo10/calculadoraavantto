import { ChartContainer } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { useEffect, useState } from "react";

const monthlyData = [
  { month: 'Jan', humano: 719000, ia: 1382280 },
  { month: 'Fev', humano: 750000, ia: 1390000 },
  { month: 'Mar', humano: 800000, ia: 1420000 },
  { month: 'Abr', humano: 780000, ia: 1450000 },
  { month: 'Mai', humano: 850000, ia: 1480000 },
  { month: 'Jun', humano: 820000, ia: 1500000 },
  { month: 'Jul', humano: 730000, ia: 1520000 },
  { month: 'Ago', humano: 790000, ia: 1550000 },
  { month: 'Set', humano: 900000, ia: 1580000 },
  { month: 'Out', humano: 950000, ia: 1600000 },
  { month: 'Nov', humano: 920000, ia: 1620000 },
  { month: 'Dez', humano: 880000, ia: 1650000 },
];

export const RevenueTrendChart = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="w-full space-y-4 mt-8 mb-[50px]">
      <h4 className="text-base sm:text-lg font-medium text-gray-900 text-center">
        Tendência de Lucratividade Mensal
      </h4>
      <div className="h-[250px] sm:h-[400px] bg-card rounded-lg p-2 sm:p-4 border border-border">
        <ChartContainer
          className="w-full"
          config={{
            humano: { color: "#ef4444" },
            ia: { color: "#22c55e" }
          }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={monthlyData}
              margin={{
                top: 20,
                right: isMobile ? 10 : 30,
                left: isMobile ? 35 : 40,
                bottom: isMobile ? 60 : 40
              }}
              barGap={0}
              barSize={isMobile ? 12 : 20}
            >
              <XAxis
                dataKey="month"
                stroke="#888888"
                fontSize={isMobile ? 10 : 12}
                tickLine={false}
                axisLine={false}
                angle={-45}
                textAnchor="end"
                height={70}
                interval={isMobile ? 1 : 0}
                padding={{ left: 10, right: 10 }}
              />
              <YAxis
                stroke="#888888"
                fontSize={isMobile ? 10 : 12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
                width={isMobile ? 35 : 45}
                interval={isMobile ? 1 : 0}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-background p-2 border border-border rounded-lg shadow-lg">
                        {payload.map((entry) => (
                          <div key={entry.name} className="text-xs sm:text-sm text-foreground">
                            <span className="font-medium">
                              {entry.name === "humano" ? "Cenário Atual: " : "Com IA: "}
                            </span>
                            <span>R$ {entry.value.toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend
                verticalAlign={isMobile ? "bottom" : "top"}
                height={36}
                wrapperStyle={{
                  fontSize: isMobile ? '10px' : '12px',
                  paddingTop: isMobile ? '20px' : '0',
                }}
                formatter={(value) => {
                  return value === "humano" ? "Cenário Atual (Humano)" : "Com IA";
                }}
              />
              <Bar
                dataKey="humano"
                name="humano"
                fill="#ef4444"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="ia"
                name="ia"
                fill="#22c55e"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </div>
  );
};