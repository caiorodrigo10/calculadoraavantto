import { Card } from "@/components/ui/card";

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
  return (
    <Card className={`p-4 sm:p-6 bg-white border border-gray-200 shadow-sm ${className}`}>
      <h3 className="text-base sm:text-lg font-semibold mb-4 text-gray-800">{title}</h3>
      <div className="space-y-3">
        {data.map((item, index) => (
          <div key={index} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <span className="text-sm sm:text-base text-gray-600">{item.label}</span>
            <span className={`text-base sm:text-xl font-bold ${item.colorClass}`}>
              {typeof item.value === 'number' ? 
                new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                }).format(item.value) : 
                item.value
              }
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
};