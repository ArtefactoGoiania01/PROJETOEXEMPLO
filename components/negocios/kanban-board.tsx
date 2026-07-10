"use client";

import { useMemo, useState, useTransition } from "react";
import {
  DndContext,
  type DragEndEvent,
  PointerSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import { Badge } from "@/components/ui/badge";
import { formatarData, formatarMoeda } from "@/lib/labels/pt-BR";
import { moverEtapaNegocio } from "@/app/(app)/negocios/actions";
import { NegocioDetailDialog } from "./negocio-detail-dialog";

export type NegocioCard = {
  id: string;
  etapaId: string;
  numero: number;
  cliente: string;
  responsavel: string;
  especificador: string | null;
  escritorio: string | null;
  codReferencia: string | null;
  dataEntrega: Date | null;
  valor: string;
  inicio: Date;
  potencialVendas: string | null;
  previsaoFechamento: Date | null;
};

type Etapa = { id: string; nome: string; cor: string };
type MotivoPerda = { id: string; nome: string };

function Card({
  card,
  onOpen,
}: {
  card: NegocioCard;
  onOpen: (card: NegocioCard) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id: card.id });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: 10,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => onOpen(card)}
      className={`flex cursor-pointer flex-col gap-1 rounded-md border bg-card p-3 text-sm shadow-sm hover:border-primary/50 ${isDragging ? "opacity-50" : ""}`}
    >
      <span className="font-semibold">{card.cliente}</span>
      <span className="text-xs text-muted-foreground">Responsável: {card.responsavel}</span>
      {card.especificador ? (
        <span className="text-xs text-muted-foreground">
          Especificador: {card.especificador}
        </span>
      ) : null}
      {card.escritorio ? (
        <span className="text-xs text-muted-foreground">Escritório: {card.escritorio}</span>
      ) : null}
      {card.codReferencia ? (
        <span className="text-xs text-muted-foreground">
          Cód. Referência: {card.codReferencia}
        </span>
      ) : null}
      {card.dataEntrega ? (
        <span className="text-xs text-muted-foreground">
          Entrega: {formatarData(card.dataEntrega)}
        </span>
      ) : null}
      <span className="font-medium">{formatarMoeda(card.valor)}</span>
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>Início {formatarData(card.inicio)}</span>
        <span>#{card.numero}</span>
      </div>
      <Badge variant="warning" className="w-fit">
        Sem atividades
      </Badge>
    </div>
  );
}

function Column({
  etapa,
  cards,
  onOpen,
}: {
  etapa: Etapa;
  cards: NegocioCard[];
  onOpen: (card: NegocioCard) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: etapa.id });
  const total = cards.reduce((sum, c) => sum + Number(c.valor), 0);

  return (
    <div className="flex h-full w-72 shrink-0 flex-col rounded-lg border bg-muted/30">
      <div
        className="flex flex-col gap-1 rounded-t-lg border-b px-3 py-2"
        style={{ borderTop: `3px solid ${etapa.cor}` }}
      >
        <span className="text-xs font-semibold uppercase">{etapa.nome}</span>
        <span className="text-xs text-muted-foreground">
          Total: {cards.length} | {formatarMoeda(total)}
        </span>
      </div>
      <div
        ref={setNodeRef}
        className={`flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto p-2 ${isOver ? "bg-accent/50" : ""}`}
      >
        {cards.map((card) => (
          <Card key={card.id} card={card} onOpen={onOpen} />
        ))}
      </div>
    </div>
  );
}

export function KanbanBoard({
  etapas,
  cards: initialCards,
  motivosPerda,
}: {
  etapas: Etapa[];
  cards: NegocioCard[];
  motivosPerda: MotivoPerda[];
}) {
  const [cards, setCards] = useState(initialCards);
  const [selected, setSelected] = useState<NegocioCard | null>(null);
  const [, startTransition] = useTransition();
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const cardsByEtapa = useMemo(() => {
    const map = new Map<string, NegocioCard[]>();
    for (const etapa of etapas) map.set(etapa.id, []);
    for (const card of cards) map.get(card.etapaId)?.push(card);
    return map;
  }, [etapas, cards]);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;
    const negocioId = String(active.id);
    const novaEtapaId = String(over.id);
    const atual = cards.find((c) => c.id === negocioId);
    if (!atual || atual.etapaId === novaEtapaId) return;

    setCards((prev) =>
      prev.map((c) => (c.id === negocioId ? { ...c, etapaId: novaEtapaId } : c)),
    );
    startTransition(() => {
      moverEtapaNegocio(negocioId, novaEtapaId);
    });
  }

  function handleClosed(negocioId: string) {
    setCards((prev) => prev.filter((c) => c.id !== negocioId));
    setSelected(null);
  }

  return (
    <>
      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <div className="flex h-full gap-3 overflow-x-auto p-4">
          {etapas.map((etapa) => (
            <Column
              key={etapa.id}
              etapa={etapa}
              cards={cardsByEtapa.get(etapa.id) ?? []}
              onOpen={setSelected}
            />
          ))}
        </div>
      </DndContext>

      <NegocioDetailDialog
        card={selected}
        motivosPerda={motivosPerda}
        onOpenChange={(open) => !open && setSelected(null)}
        onResolved={handleClosed}
      />
    </>
  );
}
