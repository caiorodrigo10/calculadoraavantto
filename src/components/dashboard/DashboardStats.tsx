import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

export const DashboardStats = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const { data: submissions, error } = await supabase
        .from('roi_submissions')
        .select('monthly_leads, current_cost, lead_value');
      
      if (error) throw error;

      const totalLeads = submissions?.reduce((sum, item) => sum + item.monthly_leads, 0) || 0;
      const avgCost = submissions?.reduce((sum, item) => sum + item.current_cost, 0) / (submissions?.length || 1);
      const avgLeadValue = submissions?.reduce((sum, item) => sum + item.lead_value, 0) / (submissions?.length || 1);

      return {
        totalSubmissions: submissions?.length || 0,
        totalLeads,
        avgCost,
        avgLeadValue,
      };
    },
  });

  if (isLoading) {
    return <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <Skeleton key={i} className="h-32" />
      ))}
    </div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="p-6">
        <h3 className="text-sm font-medium text-gray-500">Total de Submissões</h3>
        <p className="text-2xl font-bold mt-2">{stats?.totalSubmissions}</p>
      </Card>
      <Card className="p-6">
        <h3 className="text-sm font-medium text-gray-500">Total de Leads</h3>
        <p className="text-2xl font-bold mt-2">{stats?.totalLeads.toLocaleString()}</p>
      </Card>
      <Card className="p-6">
        <h3 className="text-sm font-medium text-gray-500">Custo Médio</h3>
        <p className="text-2xl font-bold mt-2">
          R$ {stats?.avgCost.toLocaleString(undefined, { maximumFractionDigits: 2 })}
        </p>
      </Card>
      <Card className="p-6">
        <h3 className="text-sm font-medium text-gray-500">Valor Médio do Lead</h3>
        <p className="text-2xl font-bold mt-2">
          R$ {stats?.avgLeadValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}
        </p>
      </Card>
    </div>
  );
};