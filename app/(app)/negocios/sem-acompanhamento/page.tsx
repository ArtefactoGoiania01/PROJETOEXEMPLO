import { getPrisma } from "@/lib/db";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatarData, formatarMoeda } from "@/lib/labels/pt-BR";

export default async function SemAcompanhamentoPage() {
  const prisma = await getPrisma();
  const negocios = await prisma.negocio.findMany({
    where: { deletedAt: null, status: "ABERTO", atividades: { none: {} } },
    include: {
      cliente: { select: { nome: true } },
      responsavel: { select: { nome: true } },
      etapa: { select: { nome: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="flex flex-col gap-4 p-4">
      <h1 className="text-lg font-semibold">Sem acompanhamento</h1>
      <p className="text-sm text-muted-foreground">
        Negócios abertos sem nenhuma atividade registrada.
      </p>
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Responsável</TableHead>
              <TableHead>Etapa</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Início</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {negocios.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
                  Nenhum negócio sem acompanhamento.
                </TableCell>
              </TableRow>
            ) : (
              negocios.map((n) => (
                <TableRow key={n.id}>
                  <TableCell>#{n.numero}</TableCell>
                  <TableCell>{n.cliente.nome}</TableCell>
                  <TableCell>{n.responsavel.nome}</TableCell>
                  <TableCell>{n.etapa.nome}</TableCell>
                  <TableCell>{formatarMoeda(n.valor.toString())}</TableCell>
                  <TableCell>{formatarData(n.inicio)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
