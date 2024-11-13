import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { session } = useAuth();

  useEffect(() => {
    if (session) {
      navigate("/dashboard");
    }
  }, [session, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full p-8 space-y-8">
        <div className="text-center">
          <img 
            src="https://unicorn-images.b-cdn.net/d911f5e3-877b-40db-a0d9-8a6e43928ff8?optimizer=gif&width=130&height=29" 
            alt="Logo"
            className="mx-auto mb-8"
            width={130}
            height={29}
          />
          <h2 className="text-2xl font-semibold text-white mb-4">
            Calculadora de ROI: Humano vs IA
          </h2>
        </div>
        <Auth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: '#ff6b00',
                  brandAccent: '#ff6b00',
                  brandButtonText: 'white',
                  defaultButtonBackground: '#1a1a1a',
                  defaultButtonBackgroundHover: '#2a2a2a',
                  inputBackground: '#1a1a1a',
                  inputBorder: '#2a2a2a',
                  inputBorderHover: '#3a3a3a',
                  inputBorderFocus: '#ff6b00',
                }
              }
            },
            className: {
              anchor: 'hidden',
              button: 'button-class',
              container: 'container-class',
              divider: 'hidden',
              label: 'label-class',
              input: 'input-class',
              message: 'message-class',
            }
          }}
          localization={{
            variables: {
              sign_in: {
                email_label: "Email",
                password_label: "Senha",
                email_input_placeholder: "Seu email",
                password_input_placeholder: "Sua senha",
                button_label: "Entrar",
                loading_button_label: "Entrando...",
                social_provider_text: "Entrar com {{provider}}"
              },
              forgotten_password: {
                link_text: "Esqueceu sua senha?",
                email_label: "Email",
                password_label: "Senha",
                email_input_placeholder: "Seu email",
                button_label: "Enviar instruções",
                loading_button_label: "Enviando instruções...",
                confirmation_text: "Verifique seu email para redefinir sua senha"
              }
            }
          }}
          theme="dark"
          providers={[]}
          view="sign_in"
        />
      </div>
    </div>
  );
};

export default Login;