import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Trash2 } from "lucide-react";
import { SearchBar } from "./SearchBar";
import { TableActions } from "./TableActions";
import { DeleteDialog } from "./DeleteDialog";
import { SubmissionsTableHeader } from "./SubmissionsTableHeader";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface Submission {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  created_at: string;
}

interface SubmissionsTableProps {
  submissions: Submission[];
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onSearch: () => void;
  onLoadMore: () => void;
  hasMore: boolean;
  onReset: () => void;
  onDelete: (ids: string[]) => void;
}

export const SubmissionsTable = ({
  submissions,
  searchTerm,
  onSearchChange,
  onSearch,
  onLoadMore,
  hasMore,
  onReset,
  onDelete,
}: SubmissionsTableProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [submissionsState, setSubmissionsState] = useState<Submission[]>(submissions);
  const [totalCount, setTotalCount] = useState<number>(0);

  useEffect(() => {
    setSubmissionsState(submissions);
    fetchTotalCount();
  }, [submissions]);

  const fetchTotalCount = async () => {
    const { count } = await supabase
      .from('roi_submissions')
      .select('*', { count: 'exact', head: true });
    setTotalCount(count || 0);
  };

  const handleSelectAll = async (checked: boolean) => {
    if (checked) {
      const { data } = await supabase
        .from('roi_submissions')
        .select('id');
      if (data) {
        setSelectedIds(data.map(item => item.id));
      }
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelect = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds(prev => [...prev, id]);
    } else {
      setSelectedIds(prev => prev.filter(i => i !== id));
    }
  };

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from('roi_submissions')
        .delete()
        .in('id', selectedIds);

      if (error) {
        toast({
          title: "Erro ao excluir",
          description: "Não foi possível excluir os itens selecionados.",
          variant: "destructive",
        });
        throw error;
      }

      // Update local state and parent component
      setSubmissionsState(prev => prev.filter(s => !selectedIds.includes(s.id)));
      await onDelete(selectedIds);
      await fetchTotalCount(); // Refresh total count
      
      toast({
        title: "Sucesso",
        description: "Itens excluídos com sucesso.",
      });

      setShowDeleteDialog(false);
      setSelectedIds([]);
    } catch (error) {
      console.error('Error deleting submissions:', error);
    }
  };

  const handleExportCSV = () => {
    const headers = ["ID", "Nome", "Email", "Data de Criação"];
    const csvData = submissionsState.map(s => [
      s.id,
      `${s.first_name} ${s.last_name}`,
      s.email,
      format(new Date(s.created_at), "dd/MM/yyyy", { locale: ptBR })
    ]);

    const csvContent = [
      headers.join(","),
      ...csvData.map(row => row.join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `submissions-${format(new Date(), "dd-MM-yyyy")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      <SearchBar
        searchTerm={searchTerm}
        onSearchChange={onSearchChange}
        onSearch={onSearch}
        onReset={onReset}
      />

      <TableActions
        selectedIds={selectedIds}
        onDelete={() => setShowDeleteDialog(true)}
        onExport={handleExportCSV}
      />

      <div className="rounded-md border">
        <Table>
          <SubmissionsTableHeader
            onSelectAll={handleSelectAll}
            checked={selectedIds.length === totalCount && totalCount > 0}
          />
          <TableBody>
            {submissionsState.map((submission) => (
              <TableRow key={submission.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedIds.includes(submission.id)}
                    onCheckedChange={(checked) => handleSelect(submission.id, checked as boolean)}
                  />
                </TableCell>
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
                <TableCell className="text-right space-x-2">
                  <Button
                    size="sm"
                    onClick={() => navigate(`/report/${submission.id}`)}
                  >
                    Ver Relatório
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => {
                      setSelectedIds([submission.id]);
                      setShowDeleteDialog(true);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {hasMore && (
        <div className="flex justify-center mt-4">
          <Button variant="outline" onClick={onLoadMore}>
            Carregar mais
          </Button>
        </div>
      )}

      <DeleteDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDelete}
        selectedCount={selectedIds.length}
      />
    </div>
  );
};