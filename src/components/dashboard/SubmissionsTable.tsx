import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Search, Trash2, RotateCcw } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

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

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(submissions.map(s => s.id));
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

  const handleDelete = () => {
    onDelete(selectedIds);
    setShowDeleteDialog(false);
    setSelectedIds([]);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Pesquisar por nome, email ou ID..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            onKeyPress={handleKeyPress}
            className="pl-9"
          />
        </div>
        <Button onClick={onSearch} variant="secondary" className="bg-orange-500 hover:bg-orange-600 text-white">
          Pesquisar
        </Button>
        {searchTerm && (
          <Button onClick={onReset} variant="ghost" size="icon">
            <RotateCcw className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="flex justify-between items-center">
        {selectedIds.length > 0 && (
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setShowDeleteDialog(true)}
          >
            Excluir Selecionados
          </Button>
        )}
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox
                  checked={selectedIds.length === submissions.length && submissions.length > 0}
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
            {submissions.map((submission) => (
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