import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2, LogOut } from "lucide-react";

interface DashboardStats {
  totalSubmissions: number;
  averageLeads: number;
  averageCost: number;
  averageRevenue: number;
}

interface RecentSubmission {
  id: string;
  first_name: string;
  last_name: string;
  created_at: string;
  monthly_leads: number;
}

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentSubmissions, setRecentSubmissions] = useState<RecentSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { session } = useAuth();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch stats
        const { data: submissions } = await supabase
          .from('roi_submissions')
          .select('monthly_leads, current_cost, calculated_results');

        if (submissions) {
          const stats = {
            totalSubmissions: submissions.length,
            averageLeads: submissions.reduce((acc, curr) => acc + curr.monthly_leads, 0) / submissions.length,
            averageCost: submissions.reduce((acc, curr) => acc + curr.current_cost, 0) / submissions.length,
            averageRevenue: submissions.reduce((acc, curr) => {
              const results = curr.calculated_results as any;
              return acc + (results?.aiRevenue || 0);
            }, 0) / submissions.length,
          };
          setStats(stats);
        }

        // Fetch recent submissions
        const { data: recent } = await supabase
          .from('roi_submissions')
          .select('id, first_name, last_name, created_at, monthly_leads')
          .order('created_at', { ascending: false })
          .limit(5);

        if (recent) {
          setRecentSubmissions(recent);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2">
            <LogOut className="h-4 w-4" />
            Sair
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <h3 className="text-sm font-medium text-gray-500">Total de Formulários</h3>
            <p className="mt-2 text-3xl font-semibold text-gray-900">{stats?.totalSubmissions || 0}</p>
          </Card>
          <Card className="p-6">
            <h3 className="text-sm font-medium text-gray-500">Média de Leads Mensais</h3>
            <p className="mt-2 text-3xl font-semibold text-gray-900">
              {Math.round(stats?.averageLeads || 0).toLocaleString()}
            </p>
          </Card>
          <Card className="p-6">
            <h3 className="text-sm font-medium text-gray-500">Média de Custo Mensal</h3>
            <p className="mt-2 text-3xl font-semibold text-gray-900">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
                .format(stats?.averageCost || 0)}
            </p>
          </Card>
          <Card className="p-6">
            <h3 className="text-sm font-medium text-gray-500">Média de Receita Potencial</h3>
            <p className="mt-2 text-3xl font-semibold text-gray-900">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
                .format(stats?.averageRevenue || 0)}
            </p>
          </Card>
        </div>

        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Últimos Cadastros</h2>
          <div className="space-y-4">
            {recentSubmissions.map((submission) => (
              <div key={submission.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-900">
                    {submission.first_name} {submission.last_name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {new Date(submission.created_at).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <Button onClick={() => navigate(`/report/${submission.id}`)}>
                  Ver Relatório
                </Button>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;