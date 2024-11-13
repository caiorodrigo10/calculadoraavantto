import { ROICalculator } from "@/components/ROICalculator";
import { Helmet } from "react-helmet";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>Calculadora ROI: SDR Humano vs IA | Avantto</title>
        <meta name="description" content="Compare o retorno sobre investimento entre SDRs humanos e IA. Calcule sua economia e potencial de crescimento com nossa calculadora especializada." />
      </Helmet>
      <div className="min-h-screen bg-background py-12">
        <ROICalculator />
      </div>
    </>
  );
};

export default Index;