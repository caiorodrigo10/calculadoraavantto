import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, Users, DollarSign, PiggyBank } from "lucide-react";

export const DashboardStats = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const { data: submissions, error } = await supabase
        .from('roi_submissions')
        .select('monthly_leads, current_cost, lead_value, calculated_results');
      
      if (error) throw error;

      if (!submissions || submissions.length === 0) {
        return {
          avgLeadsPerSubmission: 0,
          avgTeamCost: 0,
          annualProfitPotential: 0,
          totalSubmissions: 0,
        };
      }

      const totalLeads = submissions.reduce((sum, item) => sum + (item.monthly_leads || 0), 0);
      const avgLeadsPerSubmission = Math.round(totalLeads / submissions.length);
      const avgTeamCost = submissions.reduce((sum, item) => sum + (item.current_cost || 0), 0) / submissions.length;
      
      // Calculate average annual profit potential
      const annualProfitPotential = submissions.reduce((sum, item) => {
        const monthlyProfit = ((item.monthly_leads || 0) * (item.lead_value || 0)) - (item.current_cost || 0);
        return sum + (monthlyProfit * 12);
      }, 0) / submissions.length;

      return {
        avgLeadsPerSubmission,
        avgTeamCost,
        annualProfitPotential,
        totalSubmissions: submissions.length,
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

  const defaultStats = {
    avgLeadsPerSubmission: 0,
    avgTeamCost: 0,
    annualProfitPotential: 0,
    totalSubmissions: 0,
  };

  const safeStats = stats || defaultStats;

  const cards = [
    {
      title: "Média de Leads por Cliente",
      value: safeStats.avgLeadsPerSubmission.toLocaleString(),
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Custo Médio de Equipe",
      value: `R$ ${safeStats.avgTeamCost.toLocaleString(undefined, { maximumFractionDigits: 2 })}`,
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Potencial de Lucro Anual",
      value: `R$ ${safeStats.annualProfitPotential.toLocaleString(undefined, { maximumFractionDigits: 2 })}`,
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Total de Análises",
      value: safeStats.totalSubmissions.toLocaleString(),
      icon: PiggyBank,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <Card key={index} className="p-6 relative overflow-hidden">
            <div className={`absolute right-0 top-0 w-24 h-24 ${card.bgColor} rounded-bl-full opacity-50`} />
            <div className="relative">
              <div className={`${card.color} mb-4`}>
                <Icon className="h-8 w-8" />
              </div>
              <h3 className="text-sm font-medium text-gray-500">{card.title}</h3>
              <p className={`text-2xl font-bold mt-2 ${card.color}`}>
                {card.value}
              </p>
            </div>
          </Card>
        )
      })}
    </div>
  );
};