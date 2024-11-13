import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { MetricsGrid } from "@/components/dashboard/MetricsGrid";
import { SubmissionsTable } from "@/components/dashboard/SubmissionsTable";

const ITEMS_PER_PAGE = 5;

const Dashboard = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [submissions, setSubmissions] = useState<any[]>([]);

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

  const { isLoading: submissionsLoading, refetch } = useQuery({
    queryKey: ["submissions", searchTerm, page],
    queryFn: async () => {
      let query = supabase.from("roi_submissions").select("*", { count: "exact" });

      if (searchTerm) {
        // Check if searchTerm might be a UUID
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (uuidRegex.test(searchTerm)) {
          query = query.eq('id', searchTerm);
        } else {
          query = query.or(
            `first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`
          );
        }
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

      if (page === 1) {
        setSubmissions(data || []);
      } else {
        setSubmissions(prev => [...prev, ...(data || [])]);
      }

      return { data, count };
    },
  });

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setPage(1);
  };

  const handleLoadMore = () => {
    setPage(prev => prev + 1);
  };

  if (metricsLoading || submissionsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <DashboardHeader />

      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

        <MetricsGrid metrics={metrics!} />

        <SubmissionsTable
          submissions={submissions}
          searchTerm={searchTerm}
          onSearchChange={handleSearch}
          onLoadMore={handleLoadMore}
          hasMore={submissions.length % ITEMS_PER_PAGE === 0 && submissions.length > 0}
        />
      </div>
    </div>
  );
};

export default Dashboard;