"use server";

import { revalidatePath } from "next/cache";

import { especificadores, novoId } from "@/lib/mock-data";
import { especificadorSchema } from "@/lib/validators/contatos";

function parseFormData(formData: FormData) {
  return especificadorSchema.safeParse({
    nome: formData.get("nome"),
    whatsapp: formData.get("whatsapp"),
    email: formData.get("email"),
    escritorioId: formData.get("escritorioId"),
  });
}

export async function criarEspecificador(formData: FormData) {
  const parsed = parseFormData(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }
  especificadores.push({
    id: novoId("especificador"),
    nome: parsed.data.nome,
    whatsapp: parsed.data.whatsapp ?? null,
    email: parsed.data.email ?? null,
    escritorioId: parsed.data.escritorioId ?? null,
  });
  revalidatePath("/contatos/especificadores");
  return {};
}

export async function atualizarEspecificador(id: string, formData: FormData) {
  const parsed = parseFormData(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }
  const item = especificadores.find((e) => e.id === id);
  if (item) {
    item.nome = parsed.data.nome;
    item.whatsapp = parsed.data.whatsapp ?? null;
    item.email = parsed.data.email ?? null;
    item.escritorioId = parsed.data.escritorioId ?? null;
  }
  revalidatePath("/contatos/especificadores");
  return {};
}

export async function excluirEspecificador(id: string) {
  const index = especificadores.findIndex((e) => e.id === id);
  if (index >= 0) especificadores.splice(index, 1);
  revalidatePath("/contatos/especificadores");
  return {};
}
