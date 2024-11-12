import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

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
          title: "Error",
          description: "Failed to load metrics",
          variant: "destructive",
        });
        throw error;
      }

      const totalSubmissions = data.length;
      const avgMonthlyLeads =
        data.reduce((acc, curr) => acc + curr.monthly_leads, 0) / totalSubmissions;
      const avgMonthlyCost =
        data.reduce((acc, curr) => acc + curr.current_cost, 0) / totalSubmissions;
      const avgPotentialRevenue =
        data.reduce(
          (acc, curr) =>
            acc + (curr.calculated_results as any).potentialRevenue,
          0
        ) / totalSubmissions;

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
          title: "Error",
          description: "Failed to load recent submissions",
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
            Total Submissions
          </h3>
          <p className="text-2xl font-bold">{metrics?.totalSubmissions}</p>
        </Card>
        <Card className="p-6">
          <h3 className="text-sm font-medium text-gray-500">
            Avg Monthly Leads
          </h3>
          <p className="text-2xl font-bold">
            {metrics?.avgMonthlyLeads.toFixed(1)}
          </p>
        </Card>
        <Card className="p-6">
          <h3 className="text-sm font-medium text-gray-500">
            Avg Monthly Cost
          </h3>
          <p className="text-2xl font-bold">
            ${metrics?.avgMonthlyCost.toFixed(2)}
          </p>
        </Card>
        <Card className="p-6">
          <h3 className="text-sm font-medium text-gray-500">
            Avg Potential Revenue
          </h3>
          <p className="text-2xl font-bold">
            ${metrics?.avgPotentialRevenue.toFixed(2)}
          </p>
        </Card>
      </div>

      <h2 className="text-2xl font-bold mb-4">Recent Submissions</h2>
      <div className="space-y-4">
        {recentSubmissions?.map((submission) => (
          <Card key={submission.id} className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium">
                  {submission.first_name} {submission.last_name}
                </h3>
                <p className="text-sm text-gray-500">{submission.email}</p>
              </div>
              <Button
                onClick={() => navigate(`/report/${submission.id}`)}
              >
                View Report
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;