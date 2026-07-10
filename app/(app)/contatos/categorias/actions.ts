"use server";

import { revalidatePath } from "next/cache";

import { categorias, novoId } from "@/lib/mock-data";
import { categoriaProdutoSchema } from "@/lib/validators/contatos";

function parseFormData(formData: FormData) {
  return categoriaProdutoSchema.safeParse({
    nome: formData.get("nome"),
  });
}

export async function criarCategoria(formData: FormData) {
  const parsed = parseFormData(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }
  categorias.push({ id: novoId("categoria"), nome: parsed.data.nome });
  revalidatePath("/contatos/categorias");
  return {};
}

export async function atualizarCategoria(id: string, formData: FormData) {
  const parsed = parseFormData(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }
  const item = categorias.find((c) => c.id === id);
  if (item) item.nome = parsed.data.nome;
  revalidatePath("/contatos/categorias");
  return {};
}

export async function excluirCategoria(id: string) {
  const index = categorias.findIndex((c) => c.id === id);
  if (index >= 0) categorias.splice(index, 1);
  revalidatePath("/contatos/categorias");
  return {};
}
