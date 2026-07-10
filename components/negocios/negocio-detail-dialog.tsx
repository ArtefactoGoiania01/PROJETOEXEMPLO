"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatarData, formatarMoeda, potencialVendasLabels } from "@/lib/labels/pt-BR";
import { marcarCancelado, marcarVendido } from "@/app/(app)/negocios/actions";
import type { NegocioCard } from "./kanban-board";

export function NegocioDetailDialog({
  card,
  motivosPerda,
  onOpenChange,
  onResolved,
}: {
  card: NegocioCard | null;
  motivosPerda: { id: string; nome: string }[];
  onOpenChange: (open: boolean) => void;
  onResolved: (negocioId: string) => void;
}) {
  const [confirmandoCancelamento, setConfirmandoCancelamento] = useState(false);
  const [motivoId, setMotivoId] = useState<string | undefined>();
  const [error, setError] = useState<string | undefined>();
  const [isPending, startTransition] = useTransition();

  if (!card) return null;

  function handleVendido() {
    startTransition(async () => {
      await marcarVendido(card!.id);
      onResolved(card!.id);
    });
  }

  function handleCancelar() {
    if (!motivoId) {
      setError("Selecione um motivo de perda.");
      return;
    }
    startTransition(async () => {
      const result = await marcarCancelado(card!.id, motivoId);
      if (result?.error) {
        setError(result.error);
        return;
      }
      onResolved(card!.id);
    });
  }

  return (
    <Dialog open={!!card} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <div className="flex items-center justify-between gap-2 pr-6">
            <DialogTitle>
              Negócio #{card.numero} — {card.cliente}
            </DialogTitle>
            <Button variant="outline" size="sm" asChild>
              <Link href={`/negocios/${card.id}/orcamento`}>Abrir negócio</Link>
            </Button>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <Info label="Responsável" value={card.responsavel} />
          <Info label="Especificador" value={card.especificador ?? "—"} />
          <Info label="Escritório" value={card.escritorio ?? "—"} />
          <Info label="Cód. Referência" value={card.codReferencia ?? "—"} />
          <Info label="Valor" value={formatarMoeda(card.valor)} />
          <Info
            label="Potencial de vendas"
            value={
              card.potencialVendas
                ? (potencialVendasLabels[card.potencialVendas] ?? card.potencialVendas)
                : "—"
            }
          />
          <Info label="Previsão de fechamento" value={formatarData(card.previsaoFechamento)} />
          <Info label="Data de entrega" value={formatarData(card.dataEntrega)} />
          <Info label="Início" value={formatarData(card.inicio)} />
        </div>

        {confirmandoCancelamento ? (
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Motivo de perda</label>
            <Select value={motivoId} onValueChange={setMotivoId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um motivo" />
              </SelectTrigger>
              <SelectContent>
                {motivosPerda.map((m) => (
                  <SelectItem key={m.id} value={m.id}>
                    {m.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ) : null}

        {error ? <p className="text-sm text-destructive">{error}</p> : null}

        <DialogFooter>
          {confirmandoCancelamento ? (
            <>
              <Button
                type="button"
                variant="outline"
                onClick={() => setConfirmandoCancelamento(false)}
              >
                Voltar
              </Button>
              <Button variant="destructive" onClick={handleCancelar} disabled={isPending}>
                {isPending ? <Loader2 className="animate-spin" /> : null}
                Confirmar cancelamento
              </Button>
            </>
          ) : (
            <>
              <Button
                type="button"
                variant="destructive"
                onClick={() => setConfirmandoCancelamento(true)}
                disabled={isPending}
              >
                Cancelado
              </Button>
              <Button type="button" onClick={handleVendido} disabled={isPending}>
                {isPending ? <Loader2 className="animate-spin" /> : null}
                $ Vendido
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span>{value}</span>
    </div>
  );
}
