"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/db";
import { requireSession } from "@/lib/rbac";
import { construtoraSchema } from "@/lib/validators/contatos";

function parseFormData(formData: FormData) {
  return construtoraSchema.safeParse({
    nome: formData.get("nome"),
  });
}

export async function criarConstrutora(formData: FormData) {
  await requireSession();
  const parsed = parseFormData(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }
  await prisma.construtora.create({ data: parsed.data });
  revalidatePath("/contatos/construtoras");
  return {};
}

export async function atualizarConstrutora(id: string, formData: FormData) {
  await requireSession();
  const parsed = parseFormData(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }
  await prisma.construtora.update({ where: { id }, data: parsed.data });
  revalidatePath("/contatos/construtoras");
  return {};
}

export async function excluirConstrutora(id: string) {
  await requireSession();
  await prisma.construtora.delete({ where: { id } });
  revalidatePath("/contatos/construtoras");
  return {};
}
