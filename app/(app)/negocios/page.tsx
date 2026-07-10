import { negocios, clientes, usuarios, especificadores, escritorios, etapasFunil, motivosPerda } from "@/lib/mock-data";
import { KanbanBoardClient } from "@/components/negocios/kanban-board-client";

export default function FunilPage() {
  const abertos = negocios.filter((n) => n.status === "ABERTO");

  const cards = abertos.map((n) => ({
    id: n.id,
    etapaId: n.etapaId,
    numero: n.numero,
    cliente: clientes.find((c) => c.id === n.clienteId)?.nome ?? "—",
    responsavel: usuarios.find((u) => u.id === n.responsavelId)?.nome ?? "—",
    especificador: especificadores.find((e) => e.id === n.especificadorId)?.nome ?? null,
    escritorio: escritorios.find((e) => e.id === n.escritorioId)?.razaoSocial ?? null,
    codReferencia: n.codReferencia,
    dataEntrega: n.dataEntrega,
    valor: n.valor,
    inicio: n.inicio,
    potencialVendas: n.potencialVendas,
    previsaoFechamento: n.previsaoFechamento,
  }));

  const etapas = etapasFunil
    .slice()
    .sort((a, b) => a.ordem - b.ordem)
    .map((e) => ({ id: e.id, nome: e.nome, cor: e.cor }));

  return (
    <KanbanBoardClient
      etapas={etapas}
      cards={cards}
      motivosPerda={motivosPerda.filter((m) => m.ativo)}
    />
  );
}
