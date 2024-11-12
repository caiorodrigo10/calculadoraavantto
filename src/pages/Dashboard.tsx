import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, LogOut, Search } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
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

const ITEMS_PER_PAGE = 5;

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { session } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

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

  const { data: submissions, isLoading: submissionsLoading } = useQuery({
    queryKey: ["submissions", searchTerm, page],
    queryFn: async () => {
      let query = supabase
        .from("roi_submissions")
        .select("*", { count: "exact" });

      if (searchTerm) {
        query = query.or(
          `first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%,id.ilike.%${searchTerm}%`
        );
      }

      const { data, error, count } = await query
        .order("created_at", { ascending: false })
        .range((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE - 1);

      if (error) {
        toast({
          title: "Erro",
          description: "Falha ao carregar submissões",
          variant: "destructive",
        });
        throw error;
      }

      return { data, count };
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
    <div>
      <div className="border-b">
        <div className="container mx-auto py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <span className="font-medium">
                Olá, {session?.user?.email}
              </span>
            </div>
            <Button variant="ghost" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </div>

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

        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Pesquisar por nome, email ou ID..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(1);
                }}
                className="pl-9"
              />
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {submissions?.data?.map((submission) => (
                  <TableRow key={submission.id}>
                    <TableCell className="font-mono text-sm">
                      {submission.id.slice(0, 8)}...
                    </TableCell>
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

          {submissions?.count && submissions.count > ITEMS_PER_PAGE && (
            <div className="flex justify-center mt-4">
              <Button
                variant="outline"
                onClick={() => setPage(page + 1)}
                disabled={page * ITEMS_PER_PAGE >= (submissions?.count || 0)}
              >
                Carregar mais
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;