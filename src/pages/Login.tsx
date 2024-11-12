import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";

const Login = () => {
  const session = useSession();
  const supabase = useSupabaseClient();
  const navigate = useNavigate();

  useEffect(() => {
    if (session) {
      navigate('/dashboard');
    }
  }, [session, navigate]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Área Administrativa</h1>
          <Button
            onClick={() => navigate("/")}
            variant="outline"
            className="hover:bg-primary hover:text-white transition-colors"
          >
            Voltar para Calculadora
          </Button>
        </div>
        
        <div className="max-w-md mx-auto bg-card p-8 rounded-lg shadow-lg">
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-center">
                Acesse sua conta
              </h2>
              <p className="mt-2 text-center text-muted-foreground">
                Entre com suas credenciais para acessar o painel
              </p>
            </div>
            <Auth
              supabaseClient={supabase}
              appearance={{
                theme: ThemeSupa,
                variables: {
                  default: {
                    colors: {
                      brand: 'rgb(37, 99, 235)',
                      brandAccent: 'rgb(29, 78, 216)',
                    },
                  },
                },
              }}
              theme="light"
              providers={[]}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;