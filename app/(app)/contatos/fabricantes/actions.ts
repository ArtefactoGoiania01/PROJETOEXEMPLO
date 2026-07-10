"use server";

import { revalidatePath } from "next/cache";

import { fabricantes, novoId } from "@/lib/mock-data";
import { fabricanteSchema } from "@/lib/validators/contatos";

function parseFormData(formData: FormData) {
  return fabricanteSchema.safeParse({
    nome: formData.get("nome"),
  });
}

export async function criarFabricante(formData: FormData) {
  const parsed = parseFormData(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }
  fabricantes.push({ id: novoId("fabricante"), nome: parsed.data.nome });
  revalidatePath("/contatos/fabricantes");
  return {};
}

export async function atualizarFabricante(id: string, formData: FormData) {
  const parsed = parseFormData(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }
  const item = fabricantes.find((f) => f.id === id);
  if (item) item.nome = parsed.data.nome;
  revalidatePath("/contatos/fabricantes");
  return {};
}

export async function excluirFabricante(id: string) {
  const index = fabricantes.findIndex((f) => f.id === id);
  if (index >= 0) fabricantes.splice(index, 1);
  revalidatePath("/contatos/fabricantes");
  return {};
}
