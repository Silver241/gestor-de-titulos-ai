import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getCurrentUser, clearCurrentUser } from "@/utils/localStorage";
import { useNavigate } from "react-router-dom";

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  const user = getCurrentUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    clearCurrentUser();
    navigate("/login");
  };

  // 👇 Primeira letra do nome
  const avatarLetter = user?.nome?.charAt(0).toUpperCase() ?? "?";

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />

        <div className="flex-1 flex flex-col">
          <header className="h-14 border-b bg-card flex items-center px-6 sticky top-0 z-10">
            {/* esquerda */}
            <SidebarTrigger className="text-[#B0C3CC] hover:text-[#B0C3CC]"/>

            {/* direita */}
            <div className="ml-auto flex items-center gap-3">
              {/* avatar */}
              <div
                className="
                  w-9 h-9 rounded-full
                  flex items-center justify-center
                  bg-muted text-foreground
                  font-semibold text-sm
                  select-none
                "
              >
                {avatarLetter}
              </div>

              {/* nome + tipo */}
              <div className="text-left leading-tight">
                <div className="text-sm font-medium text-foreground">
                  {user?.nome ?? ""}
                </div>
                <div className="text-xs text-muted-foreground">
                  {user?.tipo === "admin"
                    ? "Administrator"
                    : "Content Editor"}
                </div>
              </div>

              {/* logout (só ícone) */}
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                aria-label="Sair"
                title="Sair"
              >
                <LogOut className="h-5 w-5 text-[#B0C3CC] hover:text-[#B0C3CC]"/>
              </Button>
            </div>
          </header>

          <main className="flex-1 p-6 bg-background">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};
