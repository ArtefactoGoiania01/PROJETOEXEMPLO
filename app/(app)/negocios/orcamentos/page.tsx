import Link from "next/link";

import { orcamentos, negocios, clientes } from "@/lib/mock-data";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatarMoeda } from "@/lib/labels/pt-BR";

export default function ListaOrcamentosPage() {
  const linhas = orcamentos.map((o) => {
    const negocio = negocios.find((n) => n.id === o.negocioId);
    const cliente = clientes.find((c) => c.id === negocio?.clienteId);
    const total = o.itens.reduce(
      (soma, item) => soma + item.quantidade * Number(item.precoUnitario),
      0,
    );
    return { orcamento: o, negocio, cliente, total };
  });

  return (
    <div className="flex flex-col gap-4 p-4">
      <h1 className="text-lg font-semibold">Lista de orçamentos</h1>
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Orçamento</TableHead>
              <TableHead>Negócio</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Itens</TableHead>
              <TableHead>Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {linhas.map(({ orcamento, negocio, cliente, total }) => (
              <TableRow key={orcamento.negocioId}>
                <TableCell>#{orcamento.numero}</TableCell>
                <TableCell>
                  {negocio ? (
                    <Link
                      href={`/negocios/${negocio.id}/orcamento`}
                      className="text-primary underline-offset-2 hover:underline"
                    >
                      #{negocio.numero}
                    </Link>
                  ) : (
                    "—"
                  )}
                </TableCell>
                <TableCell>{cliente?.nome ?? "—"}</TableCell>
                <TableCell>{orcamento.itens.length}</TableCell>
                <TableCell>{formatarMoeda(total)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
