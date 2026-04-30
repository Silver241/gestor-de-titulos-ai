import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown, Settings } from "lucide-react";
import { useOrgaos, useProgramas } from "@/hooks/useApi";
import { getCurrentUser } from "@/utils/localStorage";
import { CardTitle } from "@/components/ui/card";
import logoRtc from "@/assets/logo-rtc.png";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

export const AppSidebar = () => {
  const location = useLocation();
  const user = getCurrentUser();
  const { data: orgaos = [] } = useOrgaos();
  const { data: programas = [] } = useProgramas();

  const [openOrgaoId, setOpenOrgaoId] = useState<number | null>(null);

  const getProgramPath = (programId: number) => {
    const programa = programas.find((p) => p.id === programId);
    return `/programa/${programa?.nome.toLowerCase().replace(/\s+/g, "-")}`;
  };

  const isActive = (path: string) => location.pathname === path;

  // abre automaticamente o órgão do programa ativo
  useEffect(() => {
    const activePrograma = programas.find((programa) =>
      isActive(getProgramPath(programa.id))
    );

    if (activePrograma) {
      setOpenOrgaoId(activePrograma.orgao);
    }
  }, [location.pathname, programas]);

  return (
    <Sidebar className="border-r border-sidebar-border h-full overflow-y-auto">
      <SidebarContent>
        <SidebarHeader className="p-3 border-b border-sidebar-border">
          <div className="flex flex-row items-center gap-3">
            <img src={logoRtc} alt="RTC Logo" className="w-12 h-auto" />
            <div className="text-lg font-semibold ">Gestor de titulos</div>
          </div>    
        </SidebarHeader>

        <SidebarGroup>
          <SidebarMenu>
            {user?.tipo === "admin" && (
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/admin")}>
                  <Link to="/admin">
                    <Settings className="mr-2 h-4 w-4" />
                    Administração
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )}
          </SidebarMenu>
        </SidebarGroup>

        {orgaos.map((orgao) => {
          const orgaoProgramas = programas.filter((p) => p.orgao === orgao.id);
          const isOpen = openOrgaoId === orgao.id;

          return (
            <Collapsible
              key={orgao.id}
              open={isOpen}
              onOpenChange={(open) => {
                setOpenOrgaoId(open ? orgao.id : null);
              }}
              className="group/collapsible"
            >
              <SidebarGroup>
                <SidebarGroupLabel asChild>
                  <CollapsibleTrigger className="flex w-full items-center justify-between">
                    {orgao.nome}
                    <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                  </CollapsibleTrigger>
                </SidebarGroupLabel>

                <CollapsibleContent>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {orgaoProgramas.map((programa) => {
                        const path = getProgramPath(programa.id);

                        return (
                          <SidebarMenuItem key={programa.id}>
                            <SidebarMenuButton asChild isActive={isActive(path)}>
                              <Link
                                to={path}
                                onClick={() => setOpenOrgaoId(orgao.id)}
                              >
                                {programa.nome}
                              </Link>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        );
                      })}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </CollapsibleContent>
              </SidebarGroup>
            </Collapsible>
          );
        })}
      </SidebarContent>
    </Sidebar>
  );
};