// src/components/GrupoForm.tsx
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useCreateGrupo } from "@/hooks/useApi";

interface GrupoFormProps {
  programaId: number;
  programaNome: string;
  onSuccess: (newGrupoId: number) => void;
}

const MONTHS_PT = [
  "Jan",
  "Fev",
  "Mar",
  "Abr",
  "Mai",
  "Jun",
  "Jul",
  "Ago",
  "Set",
  "Out",
  "Nov",
  "Dez",
];

function buildNomeGrupo(programaNome: string, date: Date) {
  const day = String(date.getDate()).padStart(2, "0");
  const month = MONTHS_PT[date.getMonth()];
  return `${programaNome} - ${day} ${month}`;
}

export const GrupoForm = ({ programaId, programaNome, onSuccess }: GrupoFormProps) => {
  const today = new Date();

  const [dataEmissao, setDataEmissao] = useState<Date>(today);
  const [nome, setNome] = useState<string>(() =>
    buildNomeGrupo(programaNome, today)
  );

  const createGrupo = useCreateGrupo();

  // Se o nome do programa mudar (troca de rota, etc), sincroniza o nome base
  useEffect(() => {
    setNome(buildNomeGrupo(programaNome, dataEmissao));
  }, [programaNome]);

  const handleDateChange = (date?: Date) => {
    if (!date) return;
    setDataEmissao(date);
    // Atualiza o nome automaticamente sempre que a data muda
    setNome(buildNomeGrupo(programaNome, date));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!dataEmissao) {
      return;
    }

    try {
      const result = await createGrupo.mutateAsync({
        nome: nome.trim(),
        data_emissao: format(dataEmissao, "yyyy-MM-dd"),
        programa: programaId,
      });

      // reset para hoje novamente
      const newToday = new Date();
      setDataEmissao(newToday);
      setNome(buildNomeGrupo(programaNome, newToday));

      onSuccess(result.data.id);
    } catch (error) {
      // Erros já tratados no hook
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="nome">Nome do Grupo *</Label>
        <Input
          id="nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Ex: Jornal da Tarde - 16 Jan"
          required
          disabled={createGrupo.isPending}
        />
        {/* <p className="text-xs text-muted-foreground">
          O nome é sugerido automaticamente com o programa e a data, mas podes editar.
        </p> */}
      </div>

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
          <PopoverContent
            className="w-auto p-0 bg-popover pointer-events-auto"
            align="start"
          >
            <Calendar
              mode="single"
              selected={dataEmissao}
              onSelect={handleDateChange}
              initialFocus
              className="pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
      </div>

      <Button type="submit" disabled={createGrupo.isPending} className="w-full">
        {createGrupo.isPending ? "Criando..." : "Criar Grupo"}
      </Button>
    </form>
  );
};
