import { toast } from "sonner";
import { programas, categorias, orgaos } from "@/data/staticData";
import { Peca, PecaWithDetails } from "@/types";

export const copyToClipboard = (text: string, label: string = "Texto") => {
  navigator.clipboard.writeText(text).then(() => {
    toast.success(`${label} copiado para área de transferência`);
  }).catch(() => {
    toast.error("Erro ao copiar texto");
  });
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

export const enrichPecaWithDetails = (peca: Peca): PecaWithDetails => {
  const categoria = categorias.find(c => c.id === peca.categoria);
  const programa = programas.find(p => p.id === peca.programa);
  
  return {
    ...peca,
    categoria_nome: peca.categoria_nome || categoria?.nome || "Desconhecida",
    programa_nome: peca.programa_nome || programa?.nome || "Desconhecido",
    grupo_nome: peca.grupo_nome || null,
  };
};

export const getProgramaById = (id: number) => {
  return programas.find(p => p.id === id);
};

export const getOrgaoById = (id: number) => {
  return orgaos.find(o => o.id === id);
};
