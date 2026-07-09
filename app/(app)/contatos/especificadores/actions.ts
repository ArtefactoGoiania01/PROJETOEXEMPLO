"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/db";
import { requireSession } from "@/lib/rbac";
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
  await requireSession();
  const parsed = parseFormData(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }
  const { escritorioId, ...rest } = parsed.data;
  await prisma.especificador.create({
    data: { ...rest, escritorioId: escritorioId ?? null },
  });
  revalidatePath("/contatos/especificadores");
  return {};
}

export async function atualizarEspecificador(id: string, formData: FormData) {
  await requireSession();
  const parsed = parseFormData(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }
  const { escritorioId, ...rest } = parsed.data;
  await prisma.especificador.update({
    where: { id },
    data: { ...rest, escritorioId: escritorioId ?? null },
  });
  revalidatePath("/contatos/especificadores");
  return {};
}

export async function excluirEspecificador(id: string) {
  await requireSession();
  await prisma.especificador.delete({ where: { id } });
  revalidatePath("/contatos/especificadores");
  return {};
}
