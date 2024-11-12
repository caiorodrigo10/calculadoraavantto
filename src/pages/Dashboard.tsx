import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

const formatNumber = (value: number) => {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }
  return value.toFixed(0);
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: metrics, isLoading: metricsLoading } = useQuery({
    queryKey: ["dashboard-metrics"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("roi_submissions")
        .select("monthly_leads, current_cost, calculated_results");

      if (error) {
        toast({
          title: "Erro",
          description: "Falha ao carregar métricas",
          variant: "destructive",
        });
        throw error;
      }

      const totalSubmissions = data.length;
      const avgMonthlyLeads =
        data.reduce((acc, curr) => acc + curr.monthly_leads, 0) / totalSubmissions || 0;
      const avgMonthlyCost =
        data.reduce((acc, curr) => acc + curr.current_cost, 0) / totalSubmissions || 0;
      const avgPotentialRevenue =
        data.reduce((acc, curr) => {
          const results = curr.calculated_results as any;
          return acc + (results?.aiRevenue || 0);
        }, 0) / totalSubmissions || 0;

      return {
        totalSubmissions,
        avgMonthlyLeads,
        avgMonthlyCost,
        avgPotentialRevenue,
      };
    },
  });

  const { data: recentSubmissions, isLoading: submissionsLoading } = useQuery({
    queryKey: ["recent-submissions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("roi_submissions")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5);

      if (error) {
        toast({
          title: "Erro",
          description: "Falha ao carregar submissões recentes",
          variant: "destructive",
        });
        throw error;
      }

      return data;
    },
  });

  if (metricsLoading || submissionsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

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

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Data</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentSubmissions?.map((submission) => (
              <TableRow key={submission.id}>
                <TableCell className="font-medium">
                  {submission.first_name} {submission.last_name}
                </TableCell>
                <TableCell>{submission.email}</TableCell>
                <TableCell>
                  {format(new Date(submission.created_at), "dd/MM/yyyy", {
                    locale: ptBR,
                  })}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    size="sm"
                    onClick={() => navigate(`/report/${submission.id}`)}
                  >
                    Ver Relatório
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Dashboard;
