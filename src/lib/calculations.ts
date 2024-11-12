interface FormData {
  monthlyLeads: number;
  responseRate: number;
  meetingRate: number;
  currentCost: number;
  leadValue: number;
  meetingsToClose: number;
}

export const calculateROI = (data: FormData) => {
  // Base calculations with fixed AI cost
  const aiCost = 997; // Fixed monthly AI cost
  const annualSavings = (data.currentCost - aiCost) * 12;
  
  // Calculate revenues with improved rates for AI (35% improvement)
  const currentRevenue = calculateMonthlyRevenue(data, 1);
  const aiRevenue = calculateMonthlyRevenue(data, 1.35);

  // Calculate ROI and other metrics
  const revenueIncrease = aiRevenue - currentRevenue;
  const costSavings = data.currentCost - aiCost;
  const totalBenefit = revenueIncrease + costSavings;
  const roi = (totalBenefit / costSavings) * 100;

  // Calculate payback period (in months)
  const monthlyBenefit = totalBenefit;
  const paybackPeriod = costSavings > 0 ? Math.ceil(aiCost / monthlyBenefit) : 0;

  // Additional insights calculations
  const additionalLeadsPerYear = calculateAdditionalLeadsPerYear(data);
  const profitPerLead = calculateProfitPerLead(data, currentRevenue, aiRevenue);

  // Comparison data for charts
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
    comparisonData,
    roi,
    paybackPeriod,
    additionalLeadsPerYear,
    profitPerLead,
    currentRevenue,
    aiRevenue,
  };
};

function calculateMonthlyRevenue(data: FormData, multiplier: number): number {
  return (
    data.monthlyLeads *
    ((data.responseRate * multiplier) / 100) *
    ((data.meetingRate * multiplier) / 100) *
    data.leadValue
  );
}

function calculateAdditionalLeadsPerYear(data: FormData): number {
  const currentMonthlyLeads =
    data.monthlyLeads * (data.responseRate / 100) * (data.meetingRate / 100);
  const aiMonthlyLeads =
    data.monthlyLeads *
    ((data.responseRate * 1.35) / 100) *
    ((data.meetingRate * 1.35) / 100);
  return Math.round((aiMonthlyLeads - currentMonthlyLeads) * 12);
}

function calculateProfitPerLead(
  data: FormData,
  currentRevenue: number,
  aiRevenue: number
): number {
  const currentLeads = data.monthlyLeads * (data.responseRate / 100);
  const aiLeads = data.monthlyLeads * ((data.responseRate * 1.35) / 100);
  return (aiRevenue / aiLeads) - (currentRevenue / currentLeads);
}