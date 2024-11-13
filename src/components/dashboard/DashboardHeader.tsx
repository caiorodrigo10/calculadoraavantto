import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export const DashboardHeader = () => {
  const navigate = useNavigate();
  const { session } = useAuth();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };
  
  return (
    <div className="border-b">
      <div className="container mx-auto py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <span className="font-medium">
              Olá, {session?.user?.email}
            </span>
            <Button 
              onClick={() => navigate('/')}
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              Ver Calculadora
            </Button>
          </div>
          <Button variant="ghost" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Sair
          </Button>
        </div>
      </div>
    </div>
  );
};