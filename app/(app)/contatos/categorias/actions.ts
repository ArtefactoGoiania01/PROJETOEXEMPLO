"use server";

import { revalidatePath } from "next/cache";

import { getPrisma } from "@/lib/db";
import { requireSession } from "@/lib/rbac";
import { categoriaProdutoSchema } from "@/lib/validators/contatos";

function parseFormData(formData: FormData) {
  return categoriaProdutoSchema.safeParse({
    nome: formData.get("nome"),
  });
}

export async function criarCategoria(formData: FormData) {
  await requireSession();
  const parsed = parseFormData(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }
  const prisma = await getPrisma();
  await prisma.categoriaProduto.create({ data: parsed.data });
  revalidatePath("/contatos/categorias");
  return {};
}

export async function atualizarCategoria(id: string, formData: FormData) {
  await requireSession();
  const parsed = parseFormData(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }
  const prisma = await getPrisma();
  await prisma.categoriaProduto.update({ where: { id }, data: parsed.data });
  revalidatePath("/contatos/categorias");
  return {};
}

export async function excluirCategoria(id: string) {
  await requireSession();
  const prisma = await getPrisma();
  await prisma.categoriaProduto.delete({ where: { id } });
  revalidatePath("/contatos/categorias");
  return {};
}
