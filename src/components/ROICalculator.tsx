import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";
import { calculateROI } from "@/lib/calculations";
import { ResultsDisplay } from "./ResultsDisplay";
import { toast } from "sonner";

interface FormData {
  monthlyLeads: number;
  responseRate: number;
  meetingRate: number;
  currentCost: number;
  leadValue: number;
  meetingsToClose: number;
}

const initialFormData: FormData = {
  monthlyLeads: 0,
  responseRate: 0,
  meetingRate: 0,
  currentCost: 0,
  leadValue: 0,
  meetingsToClose: 0,
};

export const ROICalculator = () => {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [results, setResults] = useState<any>(null);

  const handleInputChange = (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (Object.values(formData).some(value => value === 0)) {
      toast.error("Por favor, preencha todos os campos com valores válidos");
      return;
    }
    const calculatedResults = calculateROI(formData);
    setResults(calculatedResults);
    toast.success("Análise concluída com sucesso!");
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fadeIn">
      <div className="space-y-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-gray-900">
            Qual é o Custo da IA vs. Agendadores Humanos?
          </h1>
          <p className="text-lg text-gray-600">
            Calcule para saber o momento certo de migrar para uma solução de qualificação e agendamento de leads automatizada.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <TooltipProvider>
            {Object.entries({
              monthlyLeads: "Total de Leads Mensais Inbound",
              responseRate: "Taxa Média de Resposta Atual (%)",
              meetingRate: "Taxa de Leads que Agendam uma Reunião (%)",
              currentCost: "Custo Mensal Atual de Agendadores Humanos (R$)",
              leadValue: "Valor de um Lead Fechado (R$)",
              meetingsToClose: "Reuniões Necessárias para Fechar um Lead",
            }).map(([field, label]) => (
              <div key={field} className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Label htmlFor={field} className="text-sm font-medium">
                    {label}
                  </Label>
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-4 w-4 text-gray-400" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="w-64">Dica: {label}</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <Input
                  id={field}
                  type="number"
                  min="0"
                  step={field.includes("Rate") ? "0.1" : "1"}
                  value={formData[field as keyof FormData] || ""}
                  onChange={handleInputChange(field as keyof FormData)}
                  className="w-full"
                />
              </div>
            ))}
          </TooltipProvider>

          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 text-white"
          >
            Executar Análise
          </Button>
        </form>
      </div>

      <ResultsDisplay results={results} />
    </div>
  );
};