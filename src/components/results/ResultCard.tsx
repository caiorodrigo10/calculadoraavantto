import { Card } from "@/components/ui/card";
import { AreaChart, Area, ResponsiveContainer } from "recharts";

interface ResultCardProps {
  title: string;
  data: {
    label: string;
    value: string | number;
    colorClass?: string;
  }[];
  className?: string;
}

export const ResultCard = ({ title, data, className = "" }: ResultCardProps) => {
  // Generate monthly projection data for revenue items
  const generateProjectionData = (value: number) => {
    const monthlyGrowth = 0.05; // 5% monthly growth
    return Array.from({ length: 12 }, (_, i) => ({
      month: i,
      value: value * Math.pow(1 + monthlyGrowth, i)
    }));
  };

  return (
    <Card className={`p-4 sm:p-6 bg-white border border-gray-200 shadow-sm ${className}`}>
      <h3 className="text-lg font-semibold mb-4 text-gray-800">{title}</h3>
      <div className="space-y-3">
        {data.map((item, index) => (
          <div key={index} className="flex justify-between items-center">
            <span className="text-sm sm:text-base text-gray-600">{item.label}</span>
            <div className="flex items-center gap-4">
              <span className={`text-lg sm:text-xl font-bold ${item.colorClass}`}>
                {typeof item.value === 'number' ? 
                  new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  }).format(item.value) : 
                  item.value
                }
              </span>
              {item.label === "Receita Potencial" && typeof item.value === 'number' && (
                <div className="w-24 h-12">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={generateProjectionData(item.value)}>
                      <defs>
                        <linearGradient id={`gradient-${index}`} x1="0" y1="0" x2="0" y2="1">
                          <stop 
                            offset="0%" 
                            stopColor={item.colorClass?.includes('green') ? '#22c55e' : '#ef4444'} 
                            stopOpacity={0.3}
                          />
                          <stop 
                            offset="100%" 
                            stopColor={item.colorClass?.includes('green') ? '#22c55e' : '#ef4444'} 
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke={item.colorClass?.includes('green') ? '#22c55e' : '#ef4444'}
                        fill={`url(#gradient-${index})`}
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};