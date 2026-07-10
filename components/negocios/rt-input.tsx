"use client";

import { useState, useTransition } from "react";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { atualizarRt } from "@/app/(app)/negocios/[id]/orcamento/actions";

export function RtInput({ negocioId, valor }: { negocioId: string; valor: string }) {
  const [rt, setRt] = useState(valor);
  const [isPending, startTransition] = useTransition();

  function salvar() {
    startTransition(() => {
      atualizarRt(negocioId, rt);
    });
  }

  return (
    <div className="flex items-center gap-2">
      <Input
        value={rt}
        onChange={(e) => setRt(e.target.value)}
        className="w-24"
      />
      <Button type="button" size="sm" variant="outline" onClick={salvar} disabled={isPending}>
        {isPending ? <Loader2 className="animate-spin" /> : "Salvar"}
      </Button>
    </div>
  );
}
