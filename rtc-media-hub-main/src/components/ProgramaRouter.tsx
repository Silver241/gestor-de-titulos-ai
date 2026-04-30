import { useParams } from "react-router-dom";
import { useProgramas } from "@/hooks/useApi";
import ProgramaBloco from "@/pages/ProgramaBloco";
import ProgramaPeca from "@/pages/ProgramaPeca";

export const ProgramaRouter = () => {
  const { programaSlug } = useParams();

  // 👉 Carrega programas reais do backend
  const { data: programas = [], isLoading } = useProgramas();

  if (isLoading) return null;

  // 👉 Encontrar o programa pelo slug
  const programa = programas.find(
    (p) => p.nome.toLowerCase().replace(/\s+/g, "-") === programaSlug
  );

  if (!programa) return null;

  // 👉 Agora usa a edição REAL do backend
  if (programa.edicao === "bloco") {
    return <ProgramaBloco />;
  }

  return <ProgramaPeca />;
};
