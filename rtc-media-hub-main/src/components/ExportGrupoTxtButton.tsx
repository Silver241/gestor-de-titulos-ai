// src/components/ExportGrupoTxtButton.tsx
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import type { Peca } from "@/types";

interface ExportGrupoTxtButtonProps {
  pecas: Peca[];
  fileName?: string;
  label?: string;
}

export const ExportGrupoTxtButton = ({
  pecas,
  fileName = "grupo_pecas.txt",
  label = "Exportar TXT",
}: ExportGrupoTxtButtonProps) => {
  const handleExport = () => {
    if (!pecas || pecas.length === 0) return;

    const lines = pecas.map((peca, index) => {
      const titulo = (peca.titulo || "").trim();
      return `${index + 1}. ${titulo}`;
    });

    const content = lines.join("\n\n\n\n\n");

    const blob = new Blob([content], {
      type: "text/plain;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const safeFileName = fileName.replace(/[^\w\-]+/g, "_");
    a.download = safeFileName || "grupo_pecas.txt";

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const disabled = !pecas || pecas.length === 0;

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleExport}
      disabled={disabled}
      className="flex items-center gap-2 bg-[#F6F6FB]
    text-[#6285AE]
    hover:text-[#6285AE]/90
    hover:bg-[#F6F6FB]/80"
    >
      <Download className="h-4 w-4" />
      {label}
    </Button>
  );
};
