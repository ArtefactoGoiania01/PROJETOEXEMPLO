"use server";

import { revalidatePath } from "next/cache";

import { construtoras, novoId } from "@/lib/mock-data";
import { construtoraSchema } from "@/lib/validators/contatos";

function parseFormData(formData: FormData) {
  return construtoraSchema.safeParse({
    nome: formData.get("nome"),
  });
}

export async function criarConstrutora(formData: FormData) {
  const parsed = parseFormData(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }
  construtoras.push({ id: novoId("construtora"), nome: parsed.data.nome });
  revalidatePath("/contatos/construtoras");
  return {};
}

export async function atualizarConstrutora(id: string, formData: FormData) {
  const parsed = parseFormData(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }
  const item = construtoras.find((c) => c.id === id);
  if (item) item.nome = parsed.data.nome;
  revalidatePath("/contatos/construtoras");
  return {};
}

export async function excluirConstrutora(id: string) {
  const index = construtoras.findIndex((c) => c.id === id);
  if (index >= 0) construtoras.splice(index, 1);
  revalidatePath("/contatos/construtoras");
  return {};
}
