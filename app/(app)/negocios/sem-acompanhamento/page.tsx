import { negocios, clientes, usuarios, etapasFunil } from "@/lib/mock-data";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatarData, formatarMoeda } from "@/lib/labels/pt-BR";

export default function SemAcompanhamentoPage() {
  const lista = negocios
    .filter((n) => n.status === "ABERTO" && !n.temAtividade)
    .map((n) => ({
      ...n,
      clienteNome: clientes.find((c) => c.id === n.clienteId)?.nome ?? "—",
      responsavelNome: usuarios.find((u) => u.id === n.responsavelId)?.nome ?? "—",
      etapaNome: etapasFunil.find((e) => e.id === n.etapaId)?.nome ?? "—",
    }));

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
            {lista.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
                  Nenhum negócio sem acompanhamento.
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
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
