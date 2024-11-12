import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InsightsSection } from "./results/InsightsSection";
import { ResultCard } from "./results/ResultCard";
import { supabase } from "@/integrations/supabase/client";

export const ROICalculator = () => {
  const [formData, setFormData] = useState({
    monthlyLeads: "",
    responseRate: "",
    meetingRate: "",
    currentCost: "",
    leadValue: "",
    meetingsToClose: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  const [results, setResults] = useState<any>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const calculateROI = () => {
    const monthlyLeads = Number(formData.monthlyLeads);
    const responseRate = Number(formData.responseRate) / 100;
    const meetingRate = Number(formData.meetingRate) / 100;
    const currentCost = Number(formData.currentCost);
    const leadValue = Number(formData.leadValue);
    const meetingsToClose = Number(formData.meetingsToClose);

    const yearlyLeads = monthlyLeads * 12;
    const additionalLeadsPerYear = yearlyLeads * 0.3; // 30% increase
    const profitPerLead = leadValue / meetingsToClose;
    const additionalRevenue = additionalLeadsPerYear * profitPerLead;
    const roi = (additionalRevenue / currentCost - 1) * 100;
    const paybackPeriod = (currentCost / additionalRevenue) * 12;

    const calculatedResults = {
      roi,
      paybackPeriod,
      additionalLeadsPerYear,
      profitPerLead,
      additionalRevenue,
    };

    setResults(calculatedResults);
    return calculatedResults;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const calculatedResults = calculateROI();

    try {
      await supabase.from("roi_submissions").insert([
        {
          ...formData,
          monthly_leads: Number(formData.monthlyLeads),
          response_rate: Number(formData.responseRate),
          meeting_rate: Number(formData.meetingRate),
          current_cost: Number(formData.currentCost),
          lead_value: Number(formData.leadValue),
          meetings_to_close: Number(formData.meetingsToClose),
          calculated_results: calculatedResults,
        },
      ]);
    } catch (error) {
      console.error("Error saving results:", error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Calculadora de ROI: IA vs Humano</h1>
      
      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="monthlyLeads">Leads Mensais</Label>
                <Input
                  id="monthlyLeads"
                  name="monthlyLeads"
                  type="number"
                  value={formData.monthlyLeads}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="responseRate">Taxa de Resposta (%)</Label>
                <Input
                  id="responseRate"
                  name="responseRate"
                  type="number"
                  value={formData.responseRate}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="meetingRate">Taxa de Reuniões (%)</Label>
                <Input
                  id="meetingRate"
                  name="meetingRate"
                  type="number"
                  value={formData.meetingRate}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="currentCost">Custo Atual (R$)</Label>
                <Input
                  id="currentCost"
                  name="currentCost"
                  type="number"
                  value={formData.currentCost}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="leadValue">Valor do Lead (R$)</Label>
                <Input
                  id="leadValue"
                  name="leadValue"
                  type="number"
                  value={formData.leadValue}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="meetingsToClose">Reuniões para Fechar</Label>
                <Input
                  id="meetingsToClose"
                  name="meetingsToClose"
                  type="number"
                  value={formData.meetingsToClose}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="firstName">Nome</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Sobrenome</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
          </Card>

          <div className="flex justify-center">
            <Button type="submit" size="lg">
              Calcular ROI
            </Button>
          </div>
        </form>

        {results && (
          <div className="mt-8 space-y-6">
            <ResultCard
              title="Resultados Financeiros"
              data={[
                {
                  label: "ROI Projetado",
                  value: `${Math.round(results.roi)}%`,
                  colorClass: "text-green-600",
                },
                {
                  label: "Receita Adicional Anual",
                  value: results.additionalRevenue,
                  colorClass: "text-green-600",
                },
              ]}
            />

            <InsightsSection
              roi={results.roi}
              paybackPeriod={results.paybackPeriod}
              additionalLeadsPerYear={results.additionalLeadsPerYear}
              profitPerLead={results.profitPerLead}
            />
          </div>
        )}
      </div>
    </div>
  );
};