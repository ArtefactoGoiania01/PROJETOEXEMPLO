"use server";

import { revalidatePath } from "next/cache";

import { escritorios, novoId } from "@/lib/mock-data";
import { escritorioSchema } from "@/lib/validators/contatos";

function parseFormData(formData: FormData) {
  return escritorioSchema.safeParse({
    razaoSocial: formData.get("razaoSocial"),
    nomeFantasia: formData.get("nomeFantasia"),
    documento: formData.get("documento"),
    contato: formData.get("contato"),
  });
}

export async function criarEscritorio(formData: FormData) {
  const parsed = parseFormData(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }
  escritorios.push({
    id: novoId("escritorio"),
    razaoSocial: parsed.data.razaoSocial,
    nomeFantasia: parsed.data.nomeFantasia ?? null,
    documento: parsed.data.documento ?? null,
    contato: parsed.data.contato ?? null,
  });
  revalidatePath("/contatos/escritorios");
  return {};
}

export async function atualizarEscritorio(id: string, formData: FormData) {
  const parsed = parseFormData(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }
  const item = escritorios.find((e) => e.id === id);
  if (item) {
    item.razaoSocial = parsed.data.razaoSocial;
    item.nomeFantasia = parsed.data.nomeFantasia ?? null;
    item.documento = parsed.data.documento ?? null;
    item.contato = parsed.data.contato ?? null;
  }
  revalidatePath("/contatos/escritorios");
  return {};
}

export async function excluirEscritorio(id: string) {
  const index = escritorios.findIndex((e) => e.id === id);
  if (index >= 0) escritorios.splice(index, 1);
  revalidatePath("/contatos/escritorios");
  return {};
}
