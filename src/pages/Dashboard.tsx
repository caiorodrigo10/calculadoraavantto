import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';

const Dashboard = () => {
  const navigate = useNavigate();

  const { data: submissions, isLoading } = useQuery({
    queryKey: ['submissions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('roi_submissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error('Erro ao fazer logout');
    } else {
      navigate('/login');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <Button onClick={handleLogout} variant="outline">
            Sair
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {submissions?.map((submission) => (
            <Card key={submission.id} className="p-6 hover:shadow-lg transition-shadow">
              <h3 className="font-semibold text-lg mb-2">
                {submission.first_name} {submission.last_name}
              </h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p>Email: {submission.email}</p>
                <p>Leads Mensais: {submission.monthly_leads}</p>
                <p>Taxa de Resposta: {submission.response_rate}%</p>
                <p>Taxa de Agendamento: {submission.meeting_rate}%</p>
                <p>Custo Atual: R$ {submission.current_cost.toLocaleString()}</p>
              </div>
              <Button 
                className="w-full mt-4"
                onClick={() => navigate(`/report/${submission.id}`)}
              >
                Ver Relatório
              </Button>
            </Card>
          ))}
        </div>

        {submissions?.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">Nenhum dado encontrado</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;