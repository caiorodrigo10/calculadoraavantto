interface FormData {
  monthlyLeads: number;
  responseRate: number;
  meetingRate: number;
  currentCost: number;
  leadValue: number;
  meetingsToClose: number;
}

export const calculateROI = (data: FormData) => {
  const aiCost = data.currentCost * 0.4;
  const annualSavings = (data.currentCost - aiCost) * 12;
  const costReduction = 60;
  const efficiencyGain = 35;

  // Calculate current and AI revenues
  const currentRevenue = data.monthlyLeads * (data.responseRate / 100) * (data.meetingRate / 100) * data.leadValue;
  const aiRevenue = data.monthlyLeads * ((data.responseRate * 1.35) / 100) * ((data.meetingRate * 1.35) / 100) * data.leadValue;

  // Calculate ROI
  const revenueIncrease = aiRevenue - currentRevenue;
  const costSavings = data.currentCost - aiCost;
  const roi = ((revenueIncrease + costSavings) / costSavings) * 100;

  // Calculate payback period (in months)
  const monthlyBenefit = revenueIncrease + costSavings;
  const paybackPeriod = costSavings > 0 ? Math.ceil(aiCost / monthlyBenefit) : 0;

  // Additional insights
  const additionalLeadsPerYear = Math.round(
    (data.monthlyLeads * ((data.responseRate * 1.35) / 100) * ((data.meetingRate * 1.35) / 100) -
      data.monthlyLeads * (data.responseRate / 100) * (data.meetingRate / 100)) * 12
  );

  const profitPerLead = (aiRevenue / (data.monthlyLeads * ((data.responseRate * 1.35) / 100))) -
    (currentRevenue / (data.monthlyLeads * (data.responseRate / 100)));

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
    roi,
    paybackPeriod,
    additionalLeadsPerYear,
    profitPerLead,
    currentRevenue,
    aiRevenue,
  };
};