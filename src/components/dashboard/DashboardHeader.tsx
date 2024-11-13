import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const DashboardHeader = () => {
  const navigate = useNavigate();
  
  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4">
        <div className="ml-auto flex items-center space-x-4">
          <Button 
            onClick={() => navigate('/')}
            className="bg-orange-500 hover:bg-orange-600 text-white"
          >
            Ver Calculadora
          </Button>
        </div>
      </div>
    </div>
  );
};