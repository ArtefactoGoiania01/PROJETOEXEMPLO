"use server";

import { revalidatePath } from "next/cache";

import { produtos, novoId } from "@/lib/mock-data";
import { produtoSchema } from "@/lib/validators/produtos";

function parseFormData(formData: FormData) {
  return produtoSchema.safeParse({
    nome: formData.get("nome"),
    categoriaId: formData.get("categoriaId"),
    fabricanteId: formData.get("fabricanteId"),
    valorUnitario: formData.get("valorUnitario"),
    unidade: formData.get("unidade"),
    descricao: formData.get("descricao"),
  });
}

export async function criarProduto(formData: FormData) {
  const parsed = parseFormData(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }
  produtos.push({
    id: novoId("produto"),
    nome: parsed.data.nome,
    categoriaId: parsed.data.categoriaId ?? null,
    fabricanteId: parsed.data.fabricanteId ?? null,
    valorUnitario: parsed.data.valorUnitario,
    unidade: parsed.data.unidade,
    descricao: parsed.data.descricao ?? null,
  });
  revalidatePath("/produtos");
  return {};
}

export async function atualizarProduto(id: string, formData: FormData) {
  const parsed = parseFormData(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }
  const item = produtos.find((p) => p.id === id);
  if (item) {
    item.nome = parsed.data.nome;
    item.categoriaId = parsed.data.categoriaId ?? null;
    item.fabricanteId = parsed.data.fabricanteId ?? null;
    item.valorUnitario = parsed.data.valorUnitario;
    item.unidade = parsed.data.unidade;
    item.descricao = parsed.data.descricao ?? null;
  }
  revalidatePath("/produtos");
  return {};
}

export async function excluirProduto(id: string) {
  const index = produtos.findIndex((p) => p.id === id);
  if (index >= 0) produtos.splice(index, 1);
  revalidatePath("/produtos");
  return {};
}
