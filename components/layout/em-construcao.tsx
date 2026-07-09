import { Construction } from "lucide-react";

export function EmConstrucao({
  titulo,
  etapaPrevista,
}: {
  titulo: string;
  etapaPrevista?: string;
}) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 p-8 text-center">
      <Construction className="size-10 text-muted-foreground" />
      <h1 className="text-lg font-semibold">{titulo}</h1>
      <p className="max-w-sm text-sm text-muted-foreground">
        Esta tela ainda não foi implementada
        {etapaPrevista ? ` — prevista para a ${etapaPrevista}.` : "."}
      </p>
    </div>
  );
}
