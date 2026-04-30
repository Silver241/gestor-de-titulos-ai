import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProgramas, usePecas } from "@/hooks/useApi";
import { PecasTable } from "@/components/PecasTable";
import { Pagination } from "@/components/Pagination";
import { PecaForm } from "@/components/PecaForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const PAGE_SIZE = 10; // deve ser igual ao do backend

const ProgramaBloco = () => {
  const { programaSlug } = useParams();
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const [showForm, setShowForm] = useState(false);

  const { data: programas = [], isLoading: loadingProgramas } = useProgramas();

  if (loadingProgramas) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Carregando dados...</p>
      </div>
    );
  }

  // 🔍 Encontrar programa pelo slug
  const programa = useMemo(
    () =>
      programas.find(
        (p) => p.nome.toLowerCase().replace(/\s+/g, "-") === programaSlug
      ),
    [programas, programaSlug]
  );

  if (!programa) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-foreground">Programa não encontrado</h2>
        <Button onClick={() => navigate("/")} className="mt-4">
          Voltar ao Dashboard
        </Button>
      </div>
    );
  }

  // 🔄 Carregar peças com PAGINAÇÃO REAL via backend
  const { data: pecasData, isLoading: loadingPecas, refetch } = usePecas(
    programa.id,
    undefined,
    currentPage
  );

  const allPecas = pecasData?.results ?? [];

  // Ordenar por data, apenas dentro da página atual
  const sortedPecas = useMemo(
    () =>
      [...allPecas].sort(
        (a, b) =>
          new Date(b.data_registro).getTime() -
          new Date(a.data_registro).getTime()
      ),
    [allPecas]
  );

  // Total de páginas REAL pelo backend
  const totalPages = pecasData ? Math.ceil(pecasData.count / PAGE_SIZE) : 1;

  // O backend já devolve apenas 10 itens → não fazemos slice
  const paginatedPecas = sortedPecas;

  const handlePecaCreated = () => {
    refetch();
    setCurrentPage(1);
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
       {/*  <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Dashboard
        </Button> */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{programa.nome}</h1>
          {/* <p className="text-muted-foreground mt-1">Modo: Bloco</p> */}
        </div>
      </div>

      {showForm ? (
        <Card>
          <CardHeader>
            <CardTitle>Criar Nova Peça</CardTitle>
            {/* <CardDescription>
              Preencha os campos abaixo para adicionar uma nova peça ao programa
            </CardDescription> */}
          </CardHeader>

          <CardContent className="space-y-4">
            <PecaForm programaId={programa.id} onSuccess={handlePecaCreated} 
            onCancel={() => setShowForm(false)}
            />

            {/* <Button
              variant="outline"
              onClick={() => setShowForm(false)}
              className="w-full"
            >
              Cancelar
            </Button> */}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            {/* <h2 className="text-xl font-semibold">
              Peças do Programa — Página {currentPage} de {totalPages}
            </h2> */}
            <Button onClick={() => setShowForm(true)}>Criar Nova Peça</Button>
          </div>

          {/* TABELA */}
          <PecasTable pecas={paginatedPecas} />

          {/* PAGINAÇÃO REAL */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      )}
    </div>
  );
};

export default ProgramaBloco;
