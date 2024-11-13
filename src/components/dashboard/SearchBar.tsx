import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, RotateCcw } from "lucide-react";

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onSearch: () => void;
  onReset: () => void;
}

export const SearchBar = ({ searchTerm, onSearchChange, onSearch, onReset }: SearchBarProps) => {
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };

  return (
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
  );
};