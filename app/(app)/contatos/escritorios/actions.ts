"use server";

import { revalidatePath } from "next/cache";

import { getPrisma } from "@/lib/db";
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
  const prisma = await getPrisma();
  await prisma.escritorio.create({ data: parsed.data });
  revalidatePath("/contatos/escritorios");
  return {};
}

export async function atualizarEscritorio(id: string, formData: FormData) {
  const parsed = parseFormData(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }
  const prisma = await getPrisma();
  await prisma.escritorio.update({ where: { id }, data: parsed.data });
  revalidatePath("/contatos/escritorios");
  return {};
}

export async function excluirEscritorio(id: string) {
  const prisma = await getPrisma();
  await prisma.escritorio.delete({ where: { id } });
  revalidatePath("/contatos/escritorios");
  return {};
}
