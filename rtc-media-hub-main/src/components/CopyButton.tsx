import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { copyToClipboard } from "@/utils/helpers";

interface CopyButtonProps {
  text: string;
  label?: string;
}

export const CopyButton = ({ text, label = "Texto" }: CopyButtonProps) => {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => copyToClipboard(text, label)}
      className="h-7 w-7 p-0 hover:bg-foreground/10"
    >
      <Copy className="h-3.5 w-3.5" />
    </Button>
  );
};
