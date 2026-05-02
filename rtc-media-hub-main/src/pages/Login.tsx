import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { toast } from "sonner";
import { authApi } from "@/services/endpoints";
import logoRtc from "@/assets/logo-rtc.png";
import background from "@/assets/background.png";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("current_user");
    if (user) {
      navigate("/");
    }
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await authApi.login({ nome: username, password });
      const { access, utilizador } = response.data;

      localStorage.setItem("auth_token", access);
      localStorage.setItem("current_user", JSON.stringify(utilizador));

      toast.success(`Bem-vindo, ${utilizador.nome}!`);

      navigate(utilizador.tipo === "admin" ? "/admin" : "/");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error || "Erro ao conectar com o servidor.";
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
      {/* overlay */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" />

      {/* animação */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md"
      >
        <Card
          className="bg-white/70 backdrop-blur-xl 
          border border-white/30 
          shadow-2xl rounded-2xl 
          transition-all duration-300 
          hover:scale-[1.02] hover:shadow-3xl"
        >
          <CardHeader className="space-y-4 text-center">
            <div className="mx-auto w-20 h-20 flex items-center justify-center">
              <img
                src={logoRtc}
                alt="RTC Logo"
                className="w-full h-full object-contain drop-shadow-md"
              />
            </div>

            <CardTitle className="text-2xl font-bold">
              Gestor de títulos
            </CardTitle>

            <CardDescription>
              Acesse sua conta para continuar
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleLogin} className="space-y-5">
              
              {/* username */}
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
                  className="bg-white/80 border border-gray-200 
                  focus:ring-2 focus:ring-primary/40 rounded-lg"
                />
              </div>

              {/* password com icon */}
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>

                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Digite sua senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                    className="pr-10 bg-white/80 border border-gray-200 
                    focus:ring-2 focus:ring-primary/40 rounded-lg"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* botão com spinner */}
              <Button
                type="submit"
                className="w-full rounded-lg text-base font-semibold 
                bg-primary hover:bg-primary/90 
                transition-all duration-300 shadow-md flex items-center justify-center gap-2"
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                {isLoading ? "Entrando..." : "Entrar"}
              </Button>

            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Login;