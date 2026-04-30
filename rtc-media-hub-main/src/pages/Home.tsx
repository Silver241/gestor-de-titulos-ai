import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Play, FileText, Users, Sparkles, ChevronDown } from "lucide-react";
import logo from "@/assets/logo-rtc.png";
import heroBackground from "@/assets/hero-background.png";

const Home = () => {
  const [showDescription, setShowDescription] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const rawUser = localStorage.getItem("current_user");
    if (rawUser) {
      try {
        const user = JSON.parse(rawUser);

        if (user?.tipo === "admin") {
          navigate("/admin", { replace: true });
        } else {
          navigate("/dashboard", { replace: true });
        }
      } catch {
        // se o JSON estiver corrompido, limpa e mantém no Home
        localStorage.removeItem("current_user");
      }
    }
  }, [navigate]);

  const goToLogin = () => navigate("/login");

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <header className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroBackground})` }}
        />

        <nav className="relative z-10 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
          <img src={logo} alt="RTC Logo" className="h-14 drop-shadow-lg" />

          {/* ✅ mesma lógica do Login: navigate */}
          <Button
            onClick={goToLogin}
            className="bg-[#6285AE] text-white hover:bg-[#6285AE]/90"
          >
            Entrar
          </Button>
        </nav>

        <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 py-24 md:py-32">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-[#1e2a6e] mb-6 leading-tight">
            Conectando<br />
            <span className="text-[#1e2a6e]">Cabo Verde ao Mundo</span>
          </h1>

          <p className="text-lg md:text-xl text-[#1e2a6e]/70 max-w-2xl mb-10">
            A plataforma integrada da Radiotelevisão de Cabo Verde para gestão,
            organização e publicação de conteúdos audiovisuais.
          </p>

          <div className="flex flex-col items-center gap-4">
            <Button
              size="lg"
              onClick={() => setShowDescription(!showDescription)}
              className="bg-[#6285AE] hover:bg-[#6285AE]/90 text-white px-8 py-6 text-lg rounded-xl shadow-lg shadow-[#6285AE]/30"
            >
              Saber mais
              <ChevronDown
                className={`ml-2 h-5 w-5 transition-transform duration-300 ${
                  showDescription ? "rotate-180" : ""
                }`}
              />
            </Button>

            <div
              className={`overflow-hidden transition-all duration-500 ease-in-out ${
                showDescription ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <div className="mt-6 max-w-2xl bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-[#2a399e]/20">
                <h3 className="text-xl font-semibold text-[#1e2a6e] mb-3">
                  Sobre a Plataforma
                </h3>
                <p className="text-[#1e2a6e]/80 leading-relaxed">
                  A plataforma de gestão multimédia da RTC foi desenvolvida para
                  centralizar e otimizar todo o fluxo de trabalho relacionado à
                  criação, organização e publicação de conteúdos audiovisuais.
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <section className="relative py-0 px-6 bg-[#f5f5f5]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#131313] mb-4 pt-10">
              Funcionalidades Principais
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard
              icon={<Play className="h-8 w-8" />}
              title="Gestão de Programas"
              description="Organize programas por órgão, categorias e edições"
            />
            <FeatureCard
              icon={<FileText className="h-8 w-8" />}
              title="Gestão de Títulos"
              description="Crie e organize títulos dos programas"
            />
            <FeatureCard
              icon={<Users className="h-8 w-8" />}
              title="Colaboração"
              description="Trabalhe em equipa com diferentes níveis de acesso"
            />
            <FeatureCard
              icon={<Sparkles className="h-8 w-8" />}
              title="Inteligência Artificial"
              description="Uso da IA para sugerir títulos personalizados para publicação"
            />
          </div>
        </div>
      </section>

      <section className="relative py-10 px-6 bg-[#f5f5f5]">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-white rounded-3xl p-8 border border-[#2a399e]/10 shadow-lg">
            <h2 className="text-3xl md:text-4xl font-bold text-[#131313] mb-4">
              Pronto para começar?
            </h2>
            <p className="text-[#273240]/60 mb-8 max-w-lg mx-auto">
              Aceda à plataforma e comece a gerir os seus conteúdos de forma eficiente
            </p>

            {/* ✅ mesma lógica do Login: navigate */}
            <Button
              size="lg"
              onClick={goToLogin}
              className="bg-[#6285AE] text-white hover:bg-[#6285AE]/90 px-8 py-6 text-lg rounded-xl font-semibold"
            >
              Aceder à Plataforma
            </Button>
          </div>
        </div>
      </section>

      <footer className="border-t border-[#2a399e]/10 py-8 px-6 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <img src={logo} alt="RTC Logo" className="h-10 opacity-70" />
          <p className="text-[#1e2a6e]/40 text-sm">
            © {new Date().getFullYear()} Radiotelevisão de Cabo Verde. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) => (
  <div className="group p-4 rounded-2xl bg-white border border-[#2a399e]/10 hover:border-[#2a399e]/20 hover:shadow-lg transition-all duration-300">
    <div
      className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
      style={{
        backgroundColor: "rgba(98, 133, 174, 0.24)",
        color: "#6285AE",
      }}
    >
      {icon}
    </div>

    <h3 className="text-lg font-semibold text-[#131313] mb-2">{title}</h3>
    <p className="text-[#273240]/60 text-sm">{description}</p>
  </div>
);

export default Home;
