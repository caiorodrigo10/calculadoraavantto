import { motion } from "framer-motion";
import { Card } from "./ui/card";

interface ComparisonCardProps {
  title: string;
  humanValue: string | number;
  aiValue: string | number;
  prefix?: string;
}

export const ComparisonCard = ({ title, humanValue, aiValue, prefix = "" }: ComparisonCardProps) => {
  return (
    <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
      <Card className="p-6 bg-white border border-gray-200 shadow-sm">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">{title}</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-700 bg-gray-50 px-2 py-1 rounded border border-gray-100">Humano</span>
            <span className="text-xl font-bold text-red-600">
              {prefix}{typeof humanValue === 'number' ? humanValue.toLocaleString() : humanValue}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-700 bg-gray-50 px-2 py-1 rounded border border-gray-100">IA</span>
            <span className="text-xl font-bold text-green-600">
              {prefix}{typeof aiValue === 'number' ? aiValue.toLocaleString() : aiValue}
            </span>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};