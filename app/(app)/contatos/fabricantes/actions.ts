"use server";

import { revalidatePath } from "next/cache";

import { getPrisma } from "@/lib/db";
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
  const prisma = await getPrisma();
  await prisma.fabricante.create({ data: parsed.data });
  revalidatePath("/contatos/fabricantes");
  return {};
}

export async function atualizarFabricante(id: string, formData: FormData) {
  const parsed = parseFormData(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }
  const prisma = await getPrisma();
  await prisma.fabricante.update({ where: { id }, data: parsed.data });
  revalidatePath("/contatos/fabricantes");
  return {};
}

export async function excluirFabricante(id: string) {
  const prisma = await getPrisma();
  await prisma.fabricante.delete({ where: { id } });
  revalidatePath("/contatos/fabricantes");
  return {};
}
