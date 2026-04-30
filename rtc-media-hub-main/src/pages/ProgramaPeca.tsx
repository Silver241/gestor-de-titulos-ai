import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  useProgramas,
  useGrupos,
  useAllPecasByPrograma,
} from "@/hooks/useApi";
import { formatDate } from "@/utils/helpers";
import { PecasTable } from "@/components/PecasTable";
import { GrupoForm } from "@/components/GrupoForm";
import { PecaForm } from "@/components/PecaForm";
import { ExportGrupoTxtButton } from "@/components/ExportGrupoTxtButton";
import { AddPreAlinhamentoButton } from "@/components/AddPreAlinhamentoButton";
import { Pagination } from "@/components/Pagination"; // 👈 IMPORTANTE
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const GRUPOS_PAGE_SIZE = 5;

const ProgramaPeca = () => {
  const { programaSlug } = useParams();
  const navigate = useNavigate();

  const [selectedGrupoId, setSelectedGrupoId] = useState<number | null>(null);
  const [openGrupoId, setOpenGrupoId] = useState<number | null>(null);
  const [showGrupoForm, setShowGrupoForm] = useState(false);
  const [creatingGrupoId, setCreatingGrupoId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1); // 👈 página dos grupos

  const { data: programas = [], isLoading: loadingProgramas } = useProgramas();

  const programa = programas.find(
    (p) => p.nome.toLowerCase().replace(/\s+/g, "-") === programaSlug
  );

  // 🔹 grupos paginados por programa
  const {
    data: gruposData,
    refetch: refetchGrupos,
    isLoading: loadingGrupos,
  } = useGrupos(programa?.id, currentPage);

  const allGrupos = gruposData?.results ?? [];
  const totalPages = gruposData
    ? Math.max(1, Math.ceil(gruposData.count / GRUPOS_PAGE_SIZE))
    : 1;

  // 🔹 todas as peças do programa (sem paginação)
  const {
    data: allPecas = [],
    refetch: refetchPecas,
    isLoading: loadingPecas,
  } = useAllPecasByPrograma(programa?.id);

  if (loadingProgramas || (!programa && !loadingProgramas)) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          {loadingProgramas ? "Carregando dados..." : "Programa não encontrado"}
        </p>
      </div>
    );
  }

  if (!programa) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-foreground">
          Programa não encontrado
        </h2>
        <Button onClick={() => navigate("/")} className="mt-4">
          Voltar ao Dashboard
        </Button>
      </div>
    );
  }

  if (programa.edicao !== "peca") {
    navigate(`/programa/${programaSlug}`, { replace: true });
    return null;
  }

  // já vêm paginados do backend; só ordena dentro da página
  const grupos = [...allGrupos].sort(
    (a, b) =>
      new Date(b.data_registro).getTime() -
      new Date(a.data_registro).getTime()
  );

  const getPecasForGrupo = (grupoId: number) => {
    return allPecas
      .filter((p) => p.grupo === grupoId)
      .sort(
        (a, b) =>
          new Date(b.data_registro).getTime() -
          new Date(a.data_registro).getTime()
      );
  };

  const handleGrupoCreated = (newGrupoId: number) => {
    refetchGrupos();
    setShowGrupoForm(false);
    setCreatingGrupoId(newGrupoId);
    setSelectedGrupoId(newGrupoId);
    setOpenGrupoId(newGrupoId);
    setCurrentPage(1); // novo grupo aparece na primeira página
  };

  const handlePecaCreated = () => {
    refetchPecas();
  };

  const handleFinishCreating = () => {
    setCreatingGrupoId(null);
    setSelectedGrupoId(null);
    setOpenGrupoId(null);
  };

  const handleSelectGrupo = (grupoId: number) => {
    setSelectedGrupoId((prev) => {
      const alreadySelected = prev === grupoId;
      const next = alreadySelected ? null : grupoId;
      setOpenGrupoId(next);
      return next;
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {programa.nome}
          </h1>
          {/* <p className="text-muted-foreground mt-1">
            Modo: Peça (com grupos)
          </p> */}
         {/*  <p className="text-xs text-muted-foreground mt-1">
            Página {currentPage} de {totalPages} • {gruposData?.count ?? 0} grupos
          </p> */}
        </div>
      </div>

      {(loadingGrupos || loadingPecas) && (
        <p className="text-sm text-muted-foreground">
          Carregando grupos e peças...
        </p>
      )}

      {creatingGrupoId ? (
        <Card className="border-primary">
          <CardHeader>
            <CardTitle>Adicionar Peças ao Grupo</CardTitle>
            <CardDescription>
              Grupo:{" "}
              {grupos.find((g) => g.id === creatingGrupoId)?.nome ||
                "Desconhecido"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <PecaForm
              programaId={programa.id}
              grupoId={creatingGrupoId}
              grupoDataEmissao={
                grupos.find((g) => g.id === creatingGrupoId)?.data_emissao ||
                undefined
              }
              onSuccess={handlePecaCreated}
            />
            <Button onClick={handleFinishCreating} className="w-full">
              Concluir
            </Button>
          </CardContent>
        </Card>
      ) : showGrupoForm ? (
        <Card>
          <CardHeader>
            <CardTitle>Criar Novo Grupo</CardTitle>
            <CardDescription>
              Primeiro crie um grupo de peças para organizar o conteúdo
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <GrupoForm
              programaId={programa.id}
              programaNome={programa.nome}
              onSuccess={handleGrupoCreated}
            />
            <Button
              variant="outline"
              onClick={() => setShowGrupoForm(false)}
              className="w-full"
            >
              Cancelar
            </Button>
          </CardContent>
        </Card>
      ) : null}

      {!creatingGrupoId && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            {!showGrupoForm && (
              <Button onClick={() => setShowGrupoForm(true)}>
                Criar Novo Grupo
              </Button>
            )}
          </div>

          {(!gruposData || grupos.length === 0) ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                Nenhum grupo criado ainda. Crie o primeiro grupo acima.
              </CardContent>
            </Card>
          ) : (
            <>
              {grupos.map((grupo) => {
                const pecas = getPecasForGrupo(grupo.id);

                return (
                  <Collapsible
                    key={grupo.id}
                    open={openGrupoId === grupo.id}
                    onOpenChange={(open) =>
                      setOpenGrupoId(open ? grupo.id : null)
                    }
                  >
                    <Card>
                      <CardHeader>
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex-1">
                            <CardTitle className="flex items-center gap-3">
                              <CollapsibleTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="p-0 h-auto"
                                >
                                  <ChevronDown className="h-5 w-5 transition-transform data-[state=open]:rotate-180" />
                                </Button>
                              </CollapsibleTrigger>
                              {grupo.nome}
                            </CardTitle>
                            <CardDescription>
                              {/* Data de emissão:{" "}
                              {formatDate(grupo.data_emissao)} • */} {pecas.length}{" "}
                              peça{pecas.length !== 1 ? "s" : ""}
                            </CardDescription>
                          </div>

                          <div className="flex items-center gap-2">
                            <ExportGrupoTxtButton
                              pecas={pecas}
                              fileName={`${programa.nome}-${grupo.nome}.txt`}
                              label="Exportar TXT"
                            />

                            <AddPreAlinhamentoButton
                              grupoId={grupo.id}
                              pdfUrl={grupo.pdf}
                              onUploaded={refetchGrupos}
                            />

                            <Button
                              variant={
                                selectedGrupoId === grupo.id
                                  ? "default"
                                  : "outline"
                              }
                              size="sm"
                              onClick={() => handleSelectGrupo(grupo.id)}
                            >
                              {selectedGrupoId === grupo.id
                                ? "Selecionado"
                                : "Adicionar Peças"}
                            </Button>
                          </div>
                        </div>
                      </CardHeader>

                      <CollapsibleContent>
                        <CardContent className="space-y-4">
                          {selectedGrupoId === grupo.id && (
                            <Card className="border-accent mb-4">
                              <CardHeader>
                                <CardTitle className="text-base">
                                  Adicionar Nova Peça
                                </CardTitle>
                              </CardHeader>
                              <CardContent>
                                <PecaForm
                                  programaId={programa.id}
                                  grupoId={grupo.id}
                                  grupoDataEmissao={grupo.data_emissao}
                                  onSuccess={handlePecaCreated}
                                />
                              </CardContent>
                            </Card>
                          )}

                          <PecasTable pecas={pecas} />
                        </CardContent>
                      </CollapsibleContent>
                    </Card>
                  </Collapsible>
                );
              })}

              {/* 👇 paginação de grupos */}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => {
                  setCurrentPage(page);
                  setOpenGrupoId(null);
                  setSelectedGrupoId(null);
                }}
              />
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ProgramaPeca;
