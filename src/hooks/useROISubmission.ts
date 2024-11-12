import { useState } from "react";
import { calculateROI } from "@/lib/calculations";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { ContactFormData } from "@/components/ContactDialog";

export const useROISubmission = (formData: any) => {
  const [results, setResults] = useState<any>(null);
  const [showContactDialog, setShowContactDialog] = useState(false);
  const [pendingResults, setPendingResults] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reportUrl, setReportUrl] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (Object.entries(formData)
        .some(([_, value]) => value === 0 || (["responseRate", "meetingRate"].includes(_) && value === 1))) {
      toast.error("Por favor, preencha todos os campos com valores válidos");
      return;
    }
    const calculatedResults = calculateROI(formData);
    setPendingResults(calculatedResults);
    setShowContactDialog(true);
  };

  const handleContactSubmit = async (contactData: ContactFormData) => {
    setIsSubmitting(true);
    try {
      const { data, error } = await supabase
        .from('roi_submissions')
        .insert({
          monthly_leads: formData.monthlyLeads,
          response_rate: formData.responseRate,
          meeting_rate: formData.meetingRate,
          current_cost: formData.currentCost,
          lead_value: formData.leadValue,
          meetings_to_close: formData.meetingsToClose,
          first_name: contactData.firstName,
          last_name: contactData.lastName,
          email: contactData.email,
          phone: contactData.phone,
          calculated_results: pendingResults
        })
        .select()
        .single();

      if (error) throw error;

      setResults(pendingResults);
      setShowContactDialog(false);
      
      const reportUrl = `${window.location.origin}/report/${data.id}`;
      setReportUrl(reportUrl);
      
      toast.success("Análise concluída com sucesso!");
    } catch (error) {
      console.error('Error saving submission:', error);
      toast.error("Erro ao salvar os dados. Por favor, tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    results,
    showContactDialog,
    setShowContactDialog,
    handleSubmit,
    handleContactSubmit,
    isSubmitting,
    reportUrl
  };
};