import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface TableActionsProps {
  selectedIds: string[];
  onDelete: () => void;
  onExport: () => void;
}

export const TableActions = ({ selectedIds, onDelete, onExport }: TableActionsProps) => {
  return (
    <div className="flex justify-between items-center">
      {selectedIds.length > 0 && (
        <Button
          variant="destructive"
          size="sm"
          onClick={onDelete}
        >
          Excluir Selecionados
        </Button>
      )}
      <Button
        variant="outline"
        size="sm"
        onClick={onExport}
        className="ml-auto"
      >
        <Download className="h-4 w-4 mr-2" />
        Exportar CSV
      </Button>
    </div>
  );
};