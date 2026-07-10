import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import {
  negocios,
  orcamentos,
  clientes,
  usuarios,
  especificadores,
  escritorios,
  produtos,
} from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ItensOrcamento } from "@/components/negocios/itens-orcamento";
import { RtInput } from "@/components/negocios/rt-input";

export default async function OrcamentoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const negocio = negocios.find((n) => n.id === id);
  const orcamento = orcamentos.find((o) => o.negocioId === id);
  if (!negocio || !orcamento) notFound();

  const cliente = clientes.find((c) => c.id === negocio.clienteId);
  const responsavel = usuarios.find((u) => u.id === negocio.responsavelId);
  const especificador = especificadores.find((e) => e.id === negocio.especificadorId);
  const escritorio = escritorios.find((e) => e.id === negocio.escritorioId);

  const produtosCatalogo = produtos.map((p) => ({
    id: p.id,
    nome: p.nome,
    valorUnitario: p.valorUnitario,
  }));

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/negocios">
            <ArrowLeft />
          </Link>
        </Button>
        <div>
          <h1 className="text-lg font-semibold">
            Orçamento #{orcamento.numero} — Negócio #{negocio.numero}
          </h1>
          <p className="text-sm text-muted-foreground">{cliente?.nome}</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Dados Gerais</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
          <Info label="Responsável" value={responsavel?.nome ?? "—"} />
          <Info label="Cliente" value={cliente?.nome ?? "—"} />
          <Info label="Especificador" value={especificador?.nome ?? "—"} />
          <Info label="Escritório" value={escritorio?.razaoSocial ?? "—"} />
          <div className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground">RT</span>
            <RtInput negocioId={negocio.id} valor={orcamento.rt} />
          </div>
        </CardContent>
      </Card>

      <ItensOrcamento negocioId={negocio.id} itens={orcamento.itens} produtos={produtosCatalogo} />
    </div>
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
