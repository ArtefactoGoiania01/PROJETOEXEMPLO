import { getPrisma } from "@/lib/db";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatarData, formatarMoeda, statusNegocioLabels } from "@/lib/labels/pt-BR";

export default async function NegociosListaPage() {
  const prisma = await getPrisma();
  const negocios = await prisma.negocio.findMany({
    where: { deletedAt: null },
    include: {
      cliente: { select: { nome: true } },
      responsavel: { select: { nome: true } },
      etapa: { select: { nome: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="flex flex-col gap-4 p-4">
      <h1 className="text-lg font-semibold">Negócios em lista</h1>
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
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {negocios.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="py-8 text-center text-muted-foreground">
                  Nenhum negócio encontrado.
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
                  <TableCell>
                    <Badge
                      variant={
                        n.status === "VENDIDO"
                          ? "success"
                          : n.status === "CANCELADO"
                            ? "destructive"
                            : "secondary"
                      }
                    >
                      {statusNegocioLabels[n.status] ?? n.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
