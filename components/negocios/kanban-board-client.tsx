"use client";

import dynamic from "next/dynamic";

// dnd-kit gera ids internos (aria-describedby) que divergem entre a
// renderização no servidor e a hidratação no cliente. Carregando só no
// cliente evita o mismatch de hidratação.
export const KanbanBoardClient = dynamic(
  () => import("./kanban-board").then((m) => m.KanbanBoard),
  {
    ssr: false,
    loading: () => (
      <div className="p-4 text-sm text-muted-foreground">Carregando funil...</div>
    ),
  },
);
