import { getPrisma } from "@/lib/db";
import { KanbanBoardClient } from "@/components/negocios/kanban-board-client";

export default async function FunilPage() {
  const prisma = await getPrisma();

  const [funil, negocios, motivosPerda] = await Promise.all([
    prisma.funil.findFirst({
      where: { nome: "VENDAS" },
      include: { etapas: { orderBy: { ordem: "asc" } } },
    }),
    prisma.negocio.findMany({
      where: { status: "ABERTO", deletedAt: null },
      include: {
        cliente: { select: { nome: true } },
        responsavel: { select: { nome: true } },
        especificador: { select: { nome: true } },
        escritorio: { select: { razaoSocial: true } },
      },
      orderBy: { createdAt: "asc" },
    }),
    prisma.motivoPerda.findMany({
      where: { ativo: true },
      orderBy: { nome: "asc" },
      select: { id: true, nome: true },
    }),
  ]);

  if (!funil) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        Nenhum funil &quot;VENDAS&quot; encontrado. Rode <code>npm run db:seed</code>.
      </div>
    );
  }

  const etapas = funil.etapas.map((e) => ({ id: e.id, nome: e.nome, cor: e.cor }));

  const cards = negocios.map((n) => ({
    id: n.id,
    etapaId: n.etapaId,
    numero: n.numero,
    cliente: n.cliente.nome,
    responsavel: n.responsavel.nome,
    especificador: n.especificador?.nome ?? null,
    escritorio: n.escritorio?.razaoSocial ?? null,
    codReferencia: n.codReferencia,
    dataEntrega: n.dataEntrega,
    valor: n.valor.toString(),
    inicio: n.inicio,
    potencialVendas: n.potencialVendas,
    previsaoFechamento: n.previsaoFechamento,
  }));

  return (
    <KanbanBoardClient etapas={etapas} cards={cards} motivosPerda={motivosPerda} />
  );
}
