import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export const LeadsTable = () => {
  const navigate = useNavigate();
  
  const { data: leads, isLoading } = useQuery({
    queryKey: ['leads'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('roi_submissions')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return <Skeleton className="h-[400px] w-full" />;
  }

  return (
    <div className="rounded-md border bg-white">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="text-gray-700 font-semibold">Nome</TableHead>
            <TableHead className="text-gray-700 font-semibold">Email</TableHead>
            <TableHead className="text-gray-700 font-semibold">Leads Mensais</TableHead>
            <TableHead className="text-gray-700 font-semibold">Data</TableHead>
            <TableHead className="text-gray-700 font-semibold">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leads?.map((lead) => (
            <TableRow key={lead.id} className="hover:bg-gray-50">
              <TableCell className="text-gray-900">
                {lead.first_name} {lead.last_name}
              </TableCell>
              <TableCell className="text-gray-900">{lead.email}</TableCell>
              <TableCell className="text-gray-900">{lead.monthly_leads}</TableCell>
              <TableCell className="text-gray-900">
                {new Date(lead.created_at).toLocaleDateString('pt-BR')}
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate(`/report/${lead.id}`)}
                  className="text-primary hover:text-primary/80"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Ver Relatório
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};