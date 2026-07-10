"use server";

import { revalidatePath } from "next/cache";

import { orcamentos, negocios, novoId } from "@/lib/mock-data";
import { itemOrcamentoSchema } from "@/lib/validators/produtos";

function recalcularValorNegocio(negocioId: string) {
  const orcamento = orcamentos.find((o) => o.negocioId === negocioId);
  const negocio = negocios.find((n) => n.id === negocioId);
  if (!orcamento || !negocio) return;
  const total = orcamento.itens.reduce(
    (soma, item) => soma + item.quantidade * Number(item.precoUnitario),
    0,
  );
  negocio.valor = total.toFixed(2);
}

export async function adicionarItem(negocioId: string, formData: FormData) {
  const parsed = itemOrcamentoSchema.safeParse({
    produtoId: formData.get("produtoId"),
    descricao: formData.get("descricao"),
    quantidade: formData.get("quantidade"),
    precoUnitario: formData.get("precoUnitario"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }
  const orcamento = orcamentos.find((o) => o.negocioId === negocioId);
  if (!orcamento) return { error: "Orçamento não encontrado." };

  orcamento.itens.push({
    id: novoId("item"),
    produtoId: parsed.data.produtoId ?? null,
    descricao: parsed.data.descricao,
    quantidade: parsed.data.quantidade,
    precoUnitario: parsed.data.precoUnitario,
  });
  recalcularValorNegocio(negocioId);
  revalidatePath(`/negocios/${negocioId}/orcamento`);
  return {};
}

export async function removerItem(negocioId: string, itemId: string) {
  const orcamento = orcamentos.find((o) => o.negocioId === negocioId);
  if (!orcamento) return { error: "Orçamento não encontrado." };
  orcamento.itens = orcamento.itens.filter((i) => i.id !== itemId);
  recalcularValorNegocio(negocioId);
  revalidatePath(`/negocios/${negocioId}/orcamento`);
  return {};
}

export async function atualizarRt(negocioId: string, rt: string) {
  const orcamento = orcamentos.find((o) => o.negocioId === negocioId);
  if (orcamento) orcamento.rt = rt;
  revalidatePath(`/negocios/${negocioId}/orcamento`);
  return {};
}
