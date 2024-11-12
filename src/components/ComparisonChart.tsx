import { Card } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface ComparisonChartProps {
  data: Array<{
    name: string;
    humano: number;
    ia: number;
  }>;
}

export const ComparisonChart = ({ data }: ComparisonChartProps) => {
  const chartHeight = 300;
  
  return (
    <div className="space-y-6">
      {data.map((item, index) => (
        <Card key={index} className="p-4 border border-gray-200">
          <h4 className="text-lg font-medium mb-4">{item.name}</h4>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height={chartHeight}>
              <BarChart data={[item]} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="humano"
                  name="Agendadores Humanos"
                  fill="#ef4444"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="ia"
                  name="Inteligência Artificial"
                  fill="#22c55e"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      ))}
    </div>
  );
};