import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
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

const formatCurrency = (value: number) => 
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

export const ROICalculator = () => {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [results, setResults] = useState<any>(null);

  const handleSliderChange = (field: keyof FormData, value: number[]) => {
    setFormData((prev) => ({ ...prev, [field]: value[0] }));
  };

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
          <h1 className="text-4xl font-bold">
            Qual é o Custo da IA vs. Agendadores Humanos?
          </h1>
          <p className="text-lg text-foreground/80">
            Calcule para saber o momento certo de migrar para uma solução de qualificação e agendamento de leads automatizada.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <TooltipProvider>
            <div className="input-group">
              <div className="flex items-center space-x-2 mb-2">
                <Label htmlFor="monthlyLeads">Total de Leads Mensais Inbound</Label>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-4 w-4 text-foreground/60" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="w-64">Total de leads recebidos mensalmente</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <div className="slider-wrapper">
                <Slider
                  id="monthlyLeads"
                  max={10000}
                  step={100}
                  value={[formData.monthlyLeads]}
                  onValueChange={(value) => handleSliderChange("monthlyLeads", value)}
                />
                <span className="value-display">{formData.monthlyLeads}</span>
              </div>
            </div>

            <div className="input-group">
              <div className="flex items-center space-x-2 mb-2">
                <Label htmlFor="responseRate">Taxa Média de Resposta Atual (%)</Label>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-4 w-4 text-foreground/60" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="w-64">Porcentagem de leads que respondem</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <div className="slider-wrapper">
                <Slider
                  id="responseRate"
                  max={100}
                  step={1}
                  value={[formData.responseRate]}
                  onValueChange={(value) => handleSliderChange("responseRate", value)}
                />
                <span className="value-display">{formData.responseRate}%</span>
              </div>
            </div>

            <div className="input-group">
              <div className="flex items-center space-x-2 mb-2">
                <Label htmlFor="meetingRate">Taxa de Leads que Agendam uma Reunião (%)</Label>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-4 w-4 text-foreground/60" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="w-64">Porcentagem de leads que agendam reunião</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <div className="slider-wrapper">
                <Slider
                  id="meetingRate"
                  max={100}
                  step={1}
                  value={[formData.meetingRate]}
                  onValueChange={(value) => handleSliderChange("meetingRate", value)}
                />
                <span className="value-display">{formData.meetingRate}%</span>
              </div>
            </div>

            <div className="input-group">
              <div className="flex items-center space-x-2 mb-2">
                <Label htmlFor="currentCost">Custo Mensal Atual de Agendadores Humanos (R$)</Label>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-4 w-4 text-foreground/60" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="w-64">Custo total mensal com agendadores</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <div className="slider-wrapper">
                <Slider
                  id="currentCost"
                  max={50000}
                  step={100}
                  value={[formData.currentCost]}
                  onValueChange={(value) => handleSliderChange("currentCost", value)}
                />
                <span className="value-display">{formatCurrency(formData.currentCost)}</span>
              </div>
            </div>

            <div className="input-group">
              <div className="flex items-center space-x-2 mb-2">
                <Label htmlFor="leadValue">Valor de um Lead Fechado (R$)</Label>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-4 w-4 text-foreground/60" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="w-64">Valor médio de um lead convertido</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <div className="slider-wrapper">
                <Slider
                  id="leadValue"
                  max={100000}
                  step={1000}
                  value={[formData.leadValue]}
                  onValueChange={(value) => handleSliderChange("leadValue", value)}
                />
                <span className="value-display">{formatCurrency(formData.leadValue)}</span>
              </div>
            </div>

            <div className="input-group">
              <div className="flex items-center space-x-2 mb-2">
                <Label htmlFor="meetingsToClose">Reuniões Necessárias para Fechar um Lead</Label>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-4 w-4 text-foreground/60" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="w-64">Número médio de reuniões até o fechamento</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <Input
                id="meetingsToClose"
                type="number"
                min="1"
                step="1"
                value={formData.meetingsToClose || ""}
                onChange={handleInputChange("meetingsToClose")}
                className="h-12 text-lg"
              />
            </div>
          </TooltipProvider>

          <Button
            type="submit"
            className="w-full h-12 text-lg bg-[#ff6b00] hover:bg-[#ff6b00]/90 transition-all duration-300 hover:scale-[1.02]"
          >
            Executar Análise
          </Button>
        </form>
      </div>

      <ResultsDisplay results={results} />
    </div>
  );
};