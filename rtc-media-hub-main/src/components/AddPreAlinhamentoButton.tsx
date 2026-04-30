import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useUploadGrupoPdf } from "@/hooks/useApi";

interface AddPreAlinhamentoButtonProps {
  grupoId: number;
  pdfUrl?: string | null;   // ⬅️ novo: saber se já tem PDF
  onUploaded?: () => void;
}

export const AddPreAlinhamentoButton = ({
  grupoId,
  pdfUrl,
  onUploaded,
}: AddPreAlinhamentoButtonProps) => {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const uploadPdf = useUploadGrupoPdf();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    try {
      await uploadPdf.mutateAsync({ id: grupoId, file });
      onUploaded?.();
      setOpen(false);
      setFile(null);
    } catch {
      // erros já tratados no hook (toast)
    }
  };

  // 🔹 Se já existir PDF → botão para exportar / abrir
  if (pdfUrl) {
    const handleExport = () => {
      // abre o PDF numa nova aba (ou o browser faz download, depende das configs)
      window.open(pdfUrl, "_blank");
    };

    return (
      <Button variant="outline" size="sm" onClick={handleExport}>
        Exportar Pré-alinhamento
      </Button>
    );
  }

  // 🔹 Se NÃO existir PDF → botão para adicionar (popup)
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Adicionar Pré-alinhamento
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar Pré-alinhamento (PDF)</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="file"
            accept="application/pdf"
            onChange={(e) =>
              setFile(e.target.files?.[0] ? e.target.files[0] : null)
            }
          />

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={uploadPdf.isPending || !file}>
              {uploadPdf.isPending ? "Enviando..." : "Guardar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
