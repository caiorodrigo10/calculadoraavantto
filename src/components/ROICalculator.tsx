import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";
import { calculateROI } from "@/lib/calculations";
import { ResultsDisplay } from "./ResultsDisplay";
import { toast } from "sonner";
import { FormField } from "./FormField";
import { ContactDialog, ContactFormData } from "./ContactDialog";

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
  const [showContactDialog, setShowContactDialog] = useState(false);
  const [pendingResults, setPendingResults] = useState<any>(null);

  const handleSliderChange = (field: keyof FormData, value: number[]) => {
    setFormData((prev) => ({ ...prev, [field]: value[0] }));
  };

  const handleInputChange = (field: keyof FormData) => (value: number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (Object.values(formData).some(value => value === 0)) {
      toast.error("Por favor, preencha todos os campos com valores válidos");
      return;
    }
    const calculatedResults = calculateROI(formData);
    setPendingResults(calculatedResults);
    setShowContactDialog(true);
  };

  const handleContactSubmit = (contactData: ContactFormData) => {
    setResults(pendingResults);
    setShowContactDialog(false);
    toast.success("Análise concluída com sucesso!");
    // Here you would typically send the contact data to your backend
    console.log("Contact data:", contactData);
  };

  // ... keep existing code (JSX for the header section)

  return (
    <div className="w-full max-w-7xl mx-auto p-6 flex flex-col items-center animate-fadeIn">
      <div className="text-center space-y-6 max-w-4xl mb-16">
        <h1 className="text-5xl font-normal leading-tight">
          Qual é o Custo da IA vs. Agendadores Humanos?
        </h1>
        <p className="text-2xl text-foreground/80">
          Calcule para saber o momento certo de migrar para uma solução de qualificação e agendamento de leads automatizada.
        </p>
        <div className="flex items-center justify-center gap-4 pt-6">
          <Button
            variant="outline"
            className="text-lg px-6 py-6 border-white hover:bg-white/10"
            onClick={() => window.open('#', '_blank')}
          >
            Leia sobre este relatório
          </Button>
          <Button
            className="text-lg px-6 py-6 bg-[#ff6b00] hover:bg-[#ff6b00]/90"
            onClick={() => window.open('#', '_blank')}
          >
            Obtenha seu bot grátis agora
          </Button>
        </div>
      </div>

      <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6 max-w-lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            <FormField
              label="Total de Leads Mensais Inbound"
              tooltipText="Total de leads recebidos mensalmente"
              value={formData.monthlyLeads}
              onChange={handleInputChange("monthlyLeads")}
              max={10000}
              step={100}
              labelClassName="font-normal"
            />

            <div className="input-group">
              <div className="flex items-center space-x-2 mb-2">
                <Label htmlFor="responseRate" className="text-lg font-normal">Taxa Média de Resposta Atual (%)</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-4 w-4 text-foreground/60" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="w-64">Porcentagem de leads que respondem</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="slider-wrapper">
                <Slider
                  id="responseRate"
                  max={100}
                  step={1}
                  value={[formData.responseRate]}
                  onValueChange={(value) => handleSliderChange("responseRate", value)}
                />
                <span className="value-display text-2xl font-bold text-[#ff6b00]">{formData.responseRate}%</span>
              </div>
            </div>

            <div className="input-group">
              <div className="flex items-center space-x-2 mb-2">
                <Label htmlFor="meetingRate" className="text-lg font-normal">Taxa de Leads que Agendam uma Reunião (%)</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-4 w-4 text-foreground/60" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="w-64">Porcentagem de leads que agendam reunião</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="slider-wrapper">
                <Slider
                  id="meetingRate"
                  max={100}
                  step={1}
                  value={[formData.meetingRate]}
                  onValueChange={(value) => handleSliderChange("meetingRate", value)}
                />
                <span className="value-display text-2xl font-bold text-[#ff6b00]">{formData.meetingRate}%</span>
              </div>
            </div>

            <FormField
              label="Custo Mensal Atual de Agendadores Humanos"
              tooltipText="Custo total mensal com agendadores"
              value={formData.currentCost}
              onChange={handleInputChange("currentCost")}
              prefix="R$"
              max={50000}
              step={100}
              labelClassName="font-normal"
            />

            <FormField
              label="Valor de um Lead Fechado"
              tooltipText="Valor médio de um lead convertido"
              value={formData.leadValue}
              onChange={handleInputChange("leadValue")}
              prefix="R$"
              max={100000}
              step={1000}
              labelClassName="font-normal"
            />

            <FormField
              label="Reuniões Necessárias para Fechar um Lead"
              tooltipText="Número médio de reuniões até o fechamento"
              value={formData.meetingsToClose}
              onChange={handleInputChange("meetingsToClose")}
              step={1}
              labelClassName="font-normal"
            />

            <Button
              type="submit"
              className="w-full h-12 text-lg bg-[#ff6b00] hover:bg-[#ff6b00]/90 transition-all duration-300 hover:scale-[1.02]"
            >
              Executar Análise
            </Button>
          </form>
        </div>

        <div className="border-2 border-dashed border-foreground/20 rounded-lg p-8 flex items-center justify-center min-h-[600px] bg-foreground/5">
          {results ? (
            <ResultsDisplay results={results} />
          ) : (
            <div className="text-center space-y-4">
              <div className="text-4xl text-foreground/40">📊</div>
              <p className="text-lg text-foreground/60">
                Os resultados da sua análise aparecerão aqui após preencher e enviar o formulário
              </p>
            </div>
          )}
        </div>
      </div>

      <ContactDialog
        open={showContactDialog}
        onOpenChange={setShowContactDialog}
        onSubmit={handleContactSubmit}
      />
    </div>
  );
};
