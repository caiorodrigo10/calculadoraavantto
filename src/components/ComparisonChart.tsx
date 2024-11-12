import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface ComparisonChartProps {
  data: any[];
}

export const ComparisonChart = ({ data }: ComparisonChartProps) => {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="humano" fill="#94a3b8" />
          <Bar dataKey="ia" fill="#2563eb" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};