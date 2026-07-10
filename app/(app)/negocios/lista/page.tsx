import { negocios, clientes, usuarios, etapasFunil } from "@/lib/mock-data";
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

export default function NegociosListaPage() {
  const lista = negocios
    .slice()
    .sort((a, b) => b.numero - a.numero)
    .map((n) => ({
      ...n,
      clienteNome: clientes.find((c) => c.id === n.clienteId)?.nome ?? "—",
      responsavelNome: usuarios.find((u) => u.id === n.responsavelId)?.nome ?? "—",
      etapaNome: etapasFunil.find((e) => e.id === n.etapaId)?.nome ?? "—",
    }));

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
            {lista.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="py-8 text-center text-muted-foreground">
                  Nenhum negócio encontrado.
                </TableCell>
              </TableRow>
            ) : (
              lista.map((n) => (
                <TableRow key={n.id}>
                  <TableCell>#{n.numero}</TableCell>
                  <TableCell>{n.clienteNome}</TableCell>
                  <TableCell>{n.responsavelNome}</TableCell>
                  <TableCell>{n.etapaNome}</TableCell>
                  <TableCell>{formatarMoeda(n.valor)}</TableCell>
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
