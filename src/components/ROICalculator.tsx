import { useState } from "react";
import { Button } from "@/components/ui/button";
import { calculateROI } from "@/lib/calculations";
import { ResultsDisplay } from "./ResultsDisplay";
import { toast } from "sonner";
import { FormField } from "./FormField";
import { ContactDialog, ContactFormData } from "./ContactDialog";
import { SummaryPreview } from "./SummaryPreview";
import { supabase } from "@/integrations/supabase/client";
import { useROIForm } from "@/hooks/useROIForm";
import { useROISubmission } from "@/hooks/useROISubmission";

export const ROICalculator = () => {
  const {
    formData,
    handleSliderChange,
    handleInputChange,
    allFieldsFilled
  } = useROIForm();

  const {
    results,
    showContactDialog,
    setShowContactDialog,
    handleSubmit,
    handleContactSubmit,
    isSubmitting,
    reportUrl
  } = useROISubmission(formData);

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 flex flex-col items-center animate-fadeIn">
      <div className="text-center space-y-4 sm:space-y-6 max-w-4xl mb-8 sm:mb-16 px-2">
        <img 
          src="https://unicorn-images.b-cdn.net/d911f5e3-877b-40db-a0d9-8a6e43928ff8?optimizer=gif&width=130&height=29" 
          alt="Logo"
          className="mx-auto mb-6 sm:mb-8"
          width={130}
          height={29}
        />
        <h1 className="text-3xl sm:text-5xl font-normal leading-tight">
          Qual é o Custo da IA vs. Agendadores Humanos?
        </h1>
        <p className="text-xl sm:text-2xl text-foreground/80 px-2">
          Calcule para saber o momento certo de migrar para uma solução de qualificação e agendamento de leads automatizada.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-4 sm:pt-6">
          <Button
            variant="outline"
            className="w-full sm:w-auto text-base sm:text-lg px-4 py-4 sm:px-6 sm:py-6 border-white hover:bg-white/10"
            onClick={() => window.open('#', '_blank')}
          >
            Leia sobre este relatório
          </Button>
          <Button
            className="w-full sm:w-auto text-base sm:text-lg px-4 py-4 sm:px-6 sm:py-6 bg-[#ff6b00] hover:bg-[#ff6b00]/90"
            onClick={() => window.open('#', '_blank')}
          >
            Obtenha seu bot grátis agora
          </Button>
        </div>
      </div>

      <div className="w-full grid grid-cols-1 lg:grid-cols-[28%_72%] gap-4 sm:gap-8">
        <div className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6 max-w-[280px] mx-auto">
            <FormField
              label="Total de Leads Mensais Inbound"
              tooltipText="Total de leads recebidos mensalmente"
              value={formData.monthlyLeads}
              onChange={handleInputChange("monthlyLeads")}
              max={10000}
              step={100}
              labelClassName="font-normal text-base"
            />
            <FormField
              label="Taxa Média de Resposta Atual (%)"
              tooltipText="Porcentagem de leads que respondem"
              value={formData.responseRate}
              onChange={handleInputChange("responseRate")}
              type="percentage"
              labelClassName="font-normal text-base"
            />
            <FormField
              label="Taxa de Leads que Agendam uma Reunião (%)"
              tooltipText="Porcentagem de leads que agendam reunião"
              value={formData.meetingRate}
              onChange={handleInputChange("meetingRate")}
              type="percentage"
              labelClassName="font-normal text-base"
            />
            <FormField
              label="Custo Mensal Atual de Agendadores Humanos"
              tooltipText="Custo total mensal com agendadores"
              value={formData.currentCost}
              onChange={handleInputChange("currentCost")}
              prefix="R$"
              max={50000}
              step={100}
              labelClassName="font-normal text-base"
            />
            <FormField
              label="Valor de um Lead Fechado"
              tooltipText="Valor médio de um lead convertido"
              value={formData.leadValue}
              onChange={handleInputChange("leadValue")}
              prefix="R$"
              max={100000}
              step={1000}
              labelClassName="font-normal text-base"
            />
            <FormField
              label="Reuniões Necessárias para Fechar um Lead"
              tooltipText="Número médio de reuniões até o fechamento"
              value={formData.meetingsToClose}
              onChange={handleInputChange("meetingsToClose")}
              step={1}
              labelClassName="font-normal text-base"
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
            <>
              <ResultsDisplay results={results} formData={formData} />
              {reportUrl && (
                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-600 mb-2">
                    Link do seu relatório personalizado:
                  </p>
                  <a
                    href={reportUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#ff6b00] hover:underline break-all"
                  >
                    {reportUrl}
                  </a>
                </div>
              )}
            </>
          ) : (
            <SummaryPreview {...formData} allFieldsFilled={allFieldsFilled} />
          )}
        </div>
      </div>

      <ContactDialog
        open={showContactDialog}
        onOpenChange={setShowContactDialog}
        onSubmit={handleContactSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};
