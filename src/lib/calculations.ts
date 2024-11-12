interface FormData {
  monthlyLeads: number;
  responseRate: number;
  meetingRate: number;
  currentCost: number;
  leadValue: number;
  meetingsToClose: number;
}

export const calculateROI = (data: FormData) => {
  // Cálculos simulados para demonstração
  const aiCost = data.currentCost * 0.4; // IA custa 40% do custo atual
  const annualSavings = (data.currentCost - aiCost) * 12;
  const costReduction = 60; // 60% de redução
  const efficiencyGain = 35; // 35% de ganho de eficiência

  const comparisonData = [
    {
      name: "Custo Mensal",
      humano: data.currentCost,
      ia: aiCost,
    },
    {
      name: "Leads Qualificados",
      humano: data.monthlyLeads * (data.responseRate / 100),
      ia: data.monthlyLeads * ((data.responseRate * 1.35) / 100),
    },
    {
      name: "Reuniões Agendadas",
      humano: data.monthlyLeads * (data.meetingRate / 100),
      ia: data.monthlyLeads * ((data.meetingRate * 1.35) / 100),
    },
  ];

  return {
    aiCost,
    annualSavings,
    costReduction,
    efficiencyGain,
    comparisonData,
  };
};