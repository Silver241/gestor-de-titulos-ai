import { useState, useMemo } from "react";
import { usePecas, useProgramas, useOrgaos } from "@/hooks/useApi";
import { PecasTable } from "@/components/PecasTable";
import { Pagination } from "@/components/Pagination";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Search } from "lucide-react";

const ITEMS_PER_PAGE = 10; // deve bater com o page_size do DRF

const Dashboard = () => {
  console.log("🚀 Dashboard component renderizado");

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrgao, setSelectedOrgao] = useState<string>("all");
  const [selectedPrograma, setSelectedPrograma] = useState<string>("all");
  const [selectedDate, setSelectedDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  console.log("🔍 Chamando hooks...");
  // 👉 agora pedindo página específica ao backend
  const {
    data: pecasData,
    isLoading,
    error: pecasError,
  } = usePecas(undefined, undefined, currentPage);
  const allPecas = pecasData?.results ?? [];

  const { data: programas = [], error: programasError } = useProgramas();
  const { data: orgaos = [], error: orgaosError } = useOrgaos();

  // Debug logs detalhados
  console.log("📊 Dashboard - Estado dos dados:");
  console.log("  - isLoading:", isLoading);
  console.log("  - allPecas:", allPecas);
  console.log("  - programas:", programas);
  console.log("  - orgaos:", orgaos);
  console.log("  - errors:", { pecasError, programasError, orgaosError });

  const filteredPecas = useMemo(() => {
    return allPecas.filter((peca) => {
      const matchesSearch =
        searchQuery === "" ||
        peca.titulo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (peca.descricao || "")
          .toLowerCase()
          .includes(searchQuery.toLowerCase());

      const matchesOrgao =
        selectedOrgao === "all" ||
        programas.find((p) => p.id === peca.programa)?.orgao ===
          parseInt(selectedOrgao);

      const matchesPrograma =
        selectedPrograma === "all" ||
        peca.programa === parseInt(selectedPrograma);

      const matchesDate =
        selectedDate === "" ||
        peca.data_registro?.startsWith(selectedDate);

      return (
        matchesSearch && matchesOrgao && matchesPrograma && matchesDate
      );
    });
  }, [
    allPecas,
    searchQuery,
    selectedOrgao,
    selectedPrograma,
    selectedDate,
    programas,
  ]);

 // usa o mesmo page size que o DRF (10)
const PAGE_SIZE = 10;

// Ordenar por mais recente (dentro da página atual)
const sortedPecas = [...filteredPecas].sort(
  (a, b) =>
    new Date(b.data_registro).getTime() -
    new Date(a.data_registro).getTime()
);

// 🔢 total de páginas baseado no count do backend e PAGE_SIZE fixo
const totalPages = pecasData ? Math.ceil(pecasData.count / PAGE_SIZE) : 1;

// Já estamos paginados pelo backend → não fazemos slice aqui
const paginatedPecas = sortedPecas;


  const availableProgramas = useMemo(() => {
    if (selectedOrgao === "all") return programas;
    return programas.filter(
      (p) => p.orgao === parseInt(selectedOrgao)
    );
  }, [selectedOrgao, programas]);

  // Mostrar erro se houver
  if (pecasError || programasError || orgaosError) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Últimas peças cadastradas no sistema
          </p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Erro ao carregar dados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              {pecasError && (
                <p className="text-destructive">
                  Erro ao carregar peças: {String(pecasError)}
                </p>
              )}
              {programasError && (
                <p className="text-destructive">
                  Erro ao carregar programas: {String(programasError)}
                </p>
              )}
              {orgaosError && (
                <p className="text-destructive">
                  Erro ao carregar órgãos: {String(orgaosError)}
                </p>
              )}
              <p className="mt-4 text-muted-foreground">
                Verifique se o servidor Django está rodando e se o
                CORS está configurado corretamente.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Dashboard
        </h1>
       {/*  <p className="text-muted-foreground mt-1">
          Últimas peças cadastradas no sisas
        </p> */}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtros e Pesquisa</CardTitle>
          {/* <CardDescription>
            {isLoading
              ? "Carregando..."
              : `${filteredPecas.length} peça${
                  filteredPecas.length !== 1 ? "s" : ""
                } nesta página`}
          </CardDescription> */}
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4 items-end flex-wrap">
            <div className="flex-1 min-w-[250px]">
             {/*  <Label htmlFor="search">Pesquisar</Label> */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  id="search"
                  placeholder="Buscar por título ou descrição..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-9"
                />
              </div>
            </div>

            <div className="w-[200px]">
              {/* <Label htmlFor="orgao">Órgão</Label> */}
              <Select
                value={selectedOrgao}
                onValueChange={(value) => {
                  setSelectedOrgao(value);
                  setSelectedPrograma("all");
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger id="orgao">
                  <SelectValue placeholder="Todos os órgãos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    Todos os órgãos
                  </SelectItem>
                  {orgaos.map((orgao) => (
                    <SelectItem
                      key={orgao.id}
                      value={orgao.id.toString()}
                    >
                      {orgao.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="w-[250px]">
            {/*   <Label htmlFor="programa">Programa</Label> */}
              <Select
                value={selectedPrograma}
                onValueChange={(value) => {
                  setSelectedPrograma(value);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger id="programa">
                  <SelectValue placeholder="Todos os programas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    Todos os programas
                  </SelectItem>
                  {availableProgramas.map((programa) => (
                    <SelectItem
                      key={programa.id}
                      value={programa.id.toString()}
                    >
                      {programa.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="w-[200px]">
             {/*  <Label htmlFor="date">Data Registro</Label> */}
              <Input
                id="date"
                type="date"
                value={selectedDate}
                onChange={(e) => {
                  setSelectedDate(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div>
        {/* <div className="mb-3 text-sm text-muted-foreground">
          Página {currentPage} de {totalPages} • Total de{" "}
          {pecasData?.count ?? 0} peças
        </div> */}

        <PecasTable pecas={paginatedPecas} />

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default Dashboard;
