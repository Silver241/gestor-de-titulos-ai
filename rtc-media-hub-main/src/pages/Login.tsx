import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { authApi } from "@/services/endpoints";
import logoRtc from "@/assets/logo-rtc.png";
import background from "@/assets/background.png";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem('current_user');
    if (user) {
      navigate("/");
    }
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log('🔑 Login - enviando credenciais');
      const response = await authApi.login({ nome: username, password });
      
      // Backend agora retorna: { message, access, refresh, utilizador }
      const { access, utilizador } = response.data;
      
      console.log('🔑 Login - resposta recebida:', utilizador);
      
      // Guardar token e user no localStorage
      localStorage.setItem('auth_token', access);
      localStorage.setItem('current_user', JSON.stringify(utilizador));
      console.log('🔑 Login - token e user guardados no localStorage');
      
      toast.success(`Bem-vindo, ${utilizador.nome}!`);
      
      if (utilizador.tipo === 'admin') {
        console.log('🔑 Login - navegando para /admin');
        navigate("/admin");
      } else {
        console.log('🔑 Login - navegando para /');
        navigate("/");
      }
    } catch (error: any) {
      console.error('🔑 Login - erro:', error);
      const errorMessage = error.response?.data?.error || "Erro ao conectar com o servidor.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
  <div
    className="min-h-screen flex items-center justify-center p-4 bg-cover bg-center relative"
    style={{ backgroundImage: `url(${background})` }}
  >
    {/* overlay mais suave */}
    <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" />

    <Card className="w-full max-w-md relative z-10 
      bg-white/70 backdrop-blur-xl 
      border border-white/30 
      shadow-2xl rounded-2xl">

      <CardHeader className="space-y-4 text-center">
        <div className="mx-auto w-20 h-20 flex items-center justify-center">
          <img
            src={logoRtc}
            alt="RTC Logo"
            className="w-full h-full object-contain drop-shadow-md"
          />
        </div>

        <CardTitle className="text-2xl font-bold tracking-tight">
          Gestor de títulos
        </CardTitle>

       {/*  <CardDescription className="text-muted-foreground text-sm">
          Acesse sua conta para continuar
        </CardDescription> */}
      </CardHeader>

      <CardContent>
        <form onSubmit={handleLogin} className="space-y-5">

          <div className="space-y-2">
            <Label htmlFor="username">Utilizador</Label>
            <Input
              id="username"
              type="text"
              placeholder="Digite seu utilizador"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={isLoading}
              className="bg-white/80 border border-gray-200 focus:ring-2 focus:ring-primary/40 rounded-lg"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              placeholder="Digite sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
              className="bg-white/80 border border-gray-200 focus:ring-2 focus:ring-primary/40 rounded-lg"
            />
          </div>

          <Button
            type="submit"
            className="w-full rounded-lg text-base font-semibold 
            bg-primary hover:bg-primary/90 
            transition-all duration-300 shadow-md"
            disabled={isLoading}
          >
            {isLoading ? "Entrando..." : "Entrar"}
          </Button>

        </form>
      </CardContent>
    </Card>
  </div>
);
};

export default Login;
