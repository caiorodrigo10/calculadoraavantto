import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";

interface SubmissionsTableHeaderProps {
  onSelectAll: (checked: boolean) => void;
  checked: boolean;
}

export const SubmissionsTableHeader = ({ onSelectAll, checked }: SubmissionsTableHeaderProps) => (
  <TableHeader>
    <TableRow>
      <TableHead className="w-[50px]">
        <Checkbox
          checked={checked}
          onCheckedChange={(checked) => onSelectAll(checked as boolean)}
        />
      </TableHead>
      <TableHead>ID</TableHead>
      <TableHead>Nome</TableHead>
      <TableHead>Email</TableHead>
      <TableHead>Data</TableHead>
      <TableHead className="text-right">Ações</TableHead>
    </TableRow>
  </TableHeader>
);