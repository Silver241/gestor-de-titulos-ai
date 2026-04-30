import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CategorySelect } from "./CategorySelect";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Sparkles, X } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useCreatePeca } from "@/hooks/useApi";
import { getCurrentUser } from "@/utils/localStorage";
import { toast } from "sonner";
import { aiApi } from "@/services/endpoints"; // ✅ NOVO

interface PecaFormProps {
  programaId: number;
  grupoId?: number | null;
  grupoDataEmissao?: string;
  onSuccess: () => void;
  onCancel?: () => void;
}

export const PecaForm = ({
  programaId,
  grupoId = null,
  grupoDataEmissao,
  onSuccess,
  onCancel,
}: PecaFormProps) => {
  const user = getCurrentUser();

  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [categoriaId, setCategoriaId] = useState("");
  const [dataEmissao, setDataEmissao] = useState<Date | undefined>(
    grupoDataEmissao ? new Date(grupoDataEmissao) : undefined
  );
  const [tituloError, setTituloError] = useState("");

  // ✅ IA
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);

  const createPeca = useCreatePeca();

  const validateTitulo = (value: string): string => {
    return "";
  };

  const handleTituloChange = (value: string) => {
    const capitalized = value.charAt(0).toUpperCase() + value.slice(1);
    setTitulo(capitalized);
    setTituloError(validateTitulo(capitalized));
    setAiSuggestions([]); // opcional: limpa sugestões quando o user edita
  };

  const handleGenerateAi = async () => {
    const base = titulo.trim();
    if (!base) {
      toast.error("Escreva um título primeiro.");
      return;
    }

    setAiLoading(true);
    try {
      const res = await aiApi.suggestPecaTitles({
        titulo: base,
        contexto: descricao.trim() || "",
      });

      const list = (res.data?.suggestions || [])
        .map((s) => String(s).trim())
        .filter(Boolean)
        .slice(0, 3);

      if (list.length === 0) {
        toast.message("A IA não devolveu sugestões. Tente novamente.");
        setAiSuggestions([]);
        return;
      }

      setAiSuggestions(list);
    } catch (error: any) {
      const msg =
        error?.response?.data?.detail ||
        error?.response?.data?.error ||
        "Erro ao gerar sugestões.";
      toast.error(msg);
    } finally {
      setAiLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const tituloValidationError = validateTitulo(titulo);
    if (tituloValidationError) {
      setTituloError(tituloValidationError);
      toast.error(tituloValidationError);
      return;
    }

    if (!grupoDataEmissao && !dataEmissao) {
      toast.error("Selecione a data de emissão");
      return;
    }

    try {
      await createPeca.mutateAsync({
        titulo: titulo.trim(),
        descricao: descricao.trim(),
        categoria: categoriaId ? parseInt(categoriaId) : null,
        programa: programaId,
        grupo: grupoId ?? null,
        data_emissao: grupoDataEmissao
          ? grupoDataEmissao
          : format(dataEmissao!, "yyyy-MM-dd"),
        utilizador: user?.id || 1,
      });

      // Reset
      setTitulo("");
      setDescricao("");
      setCategoriaId("");
      setDataEmissao(grupoDataEmissao ? new Date(grupoDataEmissao) : undefined);
      setTituloError("");
      setAiSuggestions([]);

      onSuccess();
    } catch {
      // erros já tratados no hook/toast
    }
  };

  const aiDisabled = createPeca.isPending || aiLoading || !titulo.trim();

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {grupoDataEmissao && (
        <p className="text-sm text-muted-foreground">
          A data desta peça será automaticamente:{" "}
          <strong>{grupoDataEmissao}</strong>
        </p>
      )}

      {/* ✅ TÍTULO 100% + BOTÃO IA */}
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-3">
          <Label htmlFor="titulo">Título *</Label>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleGenerateAi}
            disabled={aiDisabled}
            className="flex items-center gap-2"
          >
            <Sparkles className="h-4 w-4" />
            {aiLoading ? "Gerando..." : "Sugestões IA"}
          </Button>
        </div>

        <Input
          id="titulo"
          value={titulo}
          onChange={(e) => handleTituloChange(e.target.value)}
          required
          disabled={createPeca.isPending}
          className={cn(tituloError && "border-destructive")}
        />

        {tituloError && (
          <p className="text-sm text-destructive">{tituloError}</p>
        )}

        {/* ✅ Sugestões */}
        {/* ✅ Sugestões (cada uma separada, com X individual) */}
{aiSuggestions.length > 0 && (
  <div className="space-y-2">
    

    {aiSuggestions.map((sug, idx) => (
      <div
        key={`${sug}-${idx}`}
        className="flex items-center gap-2 rounded-md bg-[#F6F6FB] px-3 py-2 hover:bg-[#BDD3ED] transition-colors"
      >
        {/* texto clicável para aplicar */}
        <button
          type="button"
          className="flex-1 text-left text-sm hover:underline"
          onClick={() => {
            setTitulo(sug);
            toast.success("Título aplicado!");
          }}
        >
          {sug}
        </button>

        {/* X para remover só esta sugestão */}
        <button
          type="button"
          className="p-1 rounded hover:bg-muted"
          aria-label="Remover sugestão"
          title="Remover"
          onClick={() => {
            setAiSuggestions((prev) => prev.filter((_, i) => i !== idx));
          }}
        >
          <X className="h-4 w-4 text-muted-foreground" />
        </button>
      </div>
    ))}
  </div>
)}
      </div>

      {/* ✅ GRID: ESQUERDA (Categoria + Data) | DIREITA (Descrição) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Coluna esquerda */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="categoria">Categoria</Label>
            <CategorySelect value={categoriaId} onChange={setCategoriaId} />
          </div>

          {/* Data só aparece se NÃO pertence ao grupo */}
          {!grupoDataEmissao && (
            <div className="space-y-2">
              <Label>Data de Emissão *</Label>

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !dataEmissao && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dataEmissao
                      ? format(dataEmissao, "dd/MM/yyyy")
                      : "Selecione uma data"}
                  </Button>
                </PopoverTrigger>

                <PopoverContent className="w-auto p-0 bg-popover" align="start">
                  <Calendar
                    mode="single"
                    selected={dataEmissao}
                    onSelect={setDataEmissao}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          )}
        </div>

        {/* Coluna direita */}
        <div className="space-y-2">
          <Label htmlFor="descricao">Descrição</Label>
          <Textarea
            id="descricao"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            disabled={createPeca.isPending}
            rows={6}
          />
        </div>
      </div>

      {/* ✅ BOTÕES LADO A LADO */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        <Button type="submit" disabled={createPeca.isPending} className="w-full">
          {createPeca.isPending ? "Criando..." : "Criar Peça"}
        </Button>

        <Button
          type="button"
          variant="destructive"
          className="w-full"
          onClick={() => onCancel?.()}
          disabled={createPeca.isPending}
        >
          Cancelar
        </Button>
      </div>
    </form>
  );
};
