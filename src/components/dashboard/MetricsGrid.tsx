import { Card } from "@/components/ui/card";
import { formatCurrency, formatNumber } from "@/lib/format";

interface MetricsGridProps {
  metrics: {
    totalSubmissions: number;
    avgMonthlyLeads: number;
    avgMonthlyCost: number;
    avgPotentialRevenue: number;
  };
}

export const MetricsGrid = ({ metrics }: MetricsGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <Card className="p-6">
        <h3 className="text-sm font-medium text-gray-500">
          Total de Submissões
        </h3>
        <p className="text-2xl font-bold">{metrics?.totalSubmissions}</p>
      </Card>
      <Card className="p-6">
        <h3 className="text-sm font-medium text-gray-500">
          Média de Leads Mensais
        </h3>
        <p className="text-2xl font-bold">
          {formatNumber(metrics?.avgMonthlyLeads || 0)}
        </p>
      </Card>
      <Card className="p-6">
        <h3 className="text-sm font-medium text-gray-500">
          Custo Médio Mensal
        </h3>
        <p className="text-2xl font-bold">
          {formatCurrency(metrics?.avgMonthlyCost || 0)}
        </p>
      </Card>
      <Card className="p-6">
        <h3 className="text-sm font-medium text-gray-500">
          Receita Potencial Média
        </h3>
        <p className="text-2xl font-bold">
          {formatCurrency(metrics?.avgPotentialRevenue || 0)}
        </p>
      </Card>
    </div>
  );
};