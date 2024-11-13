import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trash2 } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { SearchBar } from "./SearchBar";
import { TableActions } from "./TableActions";

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
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [submissionsState, setSubmissionsState] = useState<Submission[]>(submissions);

  // Update local state when submissions prop changes
  React.useEffect(() => {
    setSubmissionsState(submissions);
  }, [submissions]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(submissionsState.map(s => s.id));
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
    await onDelete(selectedIds);
    // Update local state immediately
    setSubmissionsState(prev => prev.filter(s => !selectedIds.includes(s.id)));
    setShowDeleteDialog(false);
    setSelectedIds([]);
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
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox
                  checked={selectedIds.length === submissionsState.length && submissionsState.length > 0}
                  onCheckedChange={(checked) => handleSelectAll(checked as boolean)}
                />
              </TableHead>
              <TableHead>ID</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Data</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
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

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso excluirá permanentemente {selectedIds.length === 1 ? 'este formulário' : 'estes formulários'}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowDeleteDialog(false)}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};