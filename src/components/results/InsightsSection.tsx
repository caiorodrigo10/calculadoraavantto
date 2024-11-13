import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";

interface InsightsSectionProps {
  roi: number;
  paybackPeriod: number;
  additionalLeadsPerYear: number;
  profitPerLead: number;
}

export const InsightsSection = ({ roi, paybackPeriod, additionalLeadsPerYear, profitPerLead }: InsightsSectionProps) => {
  return (
    <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
      <Card className="p-4 sm:p-6 bg-white border border-green-200 shadow-sm">
        <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">Insights Adicionais</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="space-y-3">
            <h4 className="font-medium text-gray-700">Impacto Financeiro</h4>
            <div>
              <p className="text-lg sm:text-2xl font-bold text-green-600">{Math.round(roi)}%</p>
              <p className="text-xs sm:text-sm text-gray-600">Retorno sobre investimento</p>
            </div>
            <div>
              <p className="text-lg sm:text-2xl font-bold text-green-600">{paybackPeriod} meses</p>
              <p className="text-xs sm:text-sm text-gray-600">Tempo de retorno do investimento</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <h4 className="font-medium text-gray-700">Benefícios Operacionais</h4>
            <div>
              <p className="text-lg sm:text-2xl font-bold text-blue-600">24/7</p>
              <p className="text-xs sm:text-sm text-gray-600">Atendimento contínuo</p>
            </div>
            <div>
              <p className="text-lg sm:text-2xl font-bold text-blue-600">-70%</p>
              <p className="text-xs sm:text-sm text-gray-600">Redução no tempo de resposta</p>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium text-gray-700">Eficiência e Produtividade</h4>
            <div>
              <p className="text-lg sm:text-2xl font-bold text-blue-600">+{additionalLeadsPerYear}</p>
              <p className="text-xs sm:text-sm text-gray-600">Leads adicionais por ano</p>
            </div>
            <div>
              <p className="text-lg sm:text-2xl font-bold text-blue-600">
                R$ {Math.round(profitPerLead).toLocaleString()}
              </p>
              <p className="text-xs sm:text-sm text-gray-600">Lucro adicional por lead</p>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};