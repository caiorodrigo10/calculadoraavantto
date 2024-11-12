import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";

interface InsightsSectionProps {
  roi: number;
  paybackPeriod: number;
  additionalLeadsPerYear: number;
  profitPerLead: number;
  formData: {
    currentCost: number;
  };
}

export const InsightsSection = ({ 
  roi, 
  paybackPeriod, 
  additionalLeadsPerYear, 
  profitPerLead,
  formData 
}: InsightsSectionProps) => {
  return (
    <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
      <Card className="p-6 sm:p-8 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100 shadow-sm">
        <h3 className="text-xl font-semibold text-blue-900 mb-6">Insights Adicionais</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-4 rounded-lg border border-blue-100 shadow-sm">
            <h4 className="font-medium text-blue-800 mb-4">Impacto Financeiro</h4>
            <div className="space-y-4">
              <div>
                <p className="text-2xl sm:text-3xl font-bold text-green-600">{Math.round(roi)}%</p>
                <p className="text-sm text-blue-600">Retorno sobre investimento</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-bold text-green-600">{paybackPeriod} meses</p>
                <p className="text-sm text-blue-600">Tempo de retorno</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg border border-blue-100 shadow-sm">
            <h4 className="font-medium text-blue-800 mb-4">Benefícios Operacionais</h4>
            <div className="space-y-4">
              <div>
                <p className="text-2xl sm:text-3xl font-bold text-blue-600">24/7</p>
                <p className="text-sm text-blue-600">Atendimento contínuo</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-bold text-blue-600">-70%</p>
                <p className="text-sm text-blue-600">Redução no tempo de resposta</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-blue-100 shadow-sm">
            <h4 className="font-medium text-blue-800 mb-4">Eficiência</h4>
            <div className="space-y-4">
              <div>
                <p className="text-2xl sm:text-3xl font-bold text-blue-600">+{additionalLeadsPerYear}</p>
                <p className="text-sm text-blue-600">Leads adicionais por ano</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-bold text-blue-600">
                  R$ {Math.round(profitPerLead).toLocaleString()}
                </p>
                <p className="text-sm text-blue-600">Lucro adicional por lead</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-blue-100 shadow-sm">
            <h4 className="font-medium text-blue-800 mb-4">Economia Anual</h4>
            <div className="space-y-4">
              <div>
                <p className="text-2xl sm:text-3xl font-bold text-green-600">
                  R$ {Math.round((formData.currentCost - 997) * 12).toLocaleString()}
                </p>
                <p className="text-sm text-blue-600">Economia total projetada</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-bold text-green-600">
                  {Math.round(((formData.currentCost - 997) / formData.currentCost) * 100)}%
                </p>
                <p className="text-sm text-blue-600">Redução de custos</p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};