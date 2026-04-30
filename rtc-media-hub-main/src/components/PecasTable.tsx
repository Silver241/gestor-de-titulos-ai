import { PecaWithDetails } from "@/types";
import { CopyButton } from "./CopyButton";
import { formatDate } from "@/utils/helpers";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface PecasTableProps {
  pecas: PecaWithDetails[];
}

export const PecasTable = ({ pecas }: PecasTableProps) => {
  return (
    <div className="rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[60px]">#</TableHead>
            <TableHead className="min-w-[200px]">Título</TableHead>
            {/* <TableHead className="min-w-[250px]">Descrição</TableHead> */}
            <TableHead>Categoria</TableHead>
            {/* <TableHead>Programa</TableHead>
            <TableHead>Grupo</TableHead> */}
            <TableHead>Data Emissão</TableHead>
            {/* <TableHead>Data Registro</TableHead> */}
          </TableRow>
        </TableHeader>
        <TableBody>
          {pecas.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-muted-foreground py-6">
                Nenhuma peça encontrada
              </TableCell>
            </TableRow>
          ) : (
            pecas.map((peca) => (
              <TableRow key={peca.id}>
                <TableCell className="font-medium">{peca.id}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-0.1">
                    <span className="truncate max-w-[600px]">{peca.titulo}</span>
                    <CopyButton text={peca.titulo} label="Título" />
                  </div>
                </TableCell>
                {/* <TableCell>
                  <div className="flex items-center gap-2">
                    <span className="truncate max-w-[230px]">{peca.descricao}</span>
                    <CopyButton text={peca.descricao} label="Descrição" />
                  </div>
                </TableCell> */}
                <TableCell>{peca.categoria_nome}</TableCell>
               {/*  <TableCell>{peca.programa_nome}</TableCell>
                <TableCell>{peca.grupo_nome || "-"}</TableCell> */}
                <TableCell>{formatDate(peca.data_emissao)}</TableCell>
                {/* <TableCell>{formatDate(peca.data_registro)}</TableCell> */}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
