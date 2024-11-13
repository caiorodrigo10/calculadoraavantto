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
            }
          }}
          theme="dark"
          providers={[]}
        />
      </div>
    </div>
  );
};

export default Login;