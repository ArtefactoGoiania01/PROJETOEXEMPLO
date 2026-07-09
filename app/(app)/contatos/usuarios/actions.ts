"use server";

import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";

import { prisma } from "@/lib/db";
import { requirePapel } from "@/lib/rbac";
import { usuarioSchema } from "@/lib/validators/contatos";

function parseFormData(formData: FormData) {
  return usuarioSchema.safeParse({
    nome: formData.get("nome"),
    email: formData.get("email"),
    papel: formData.get("papel"),
    ativo: formData.get("ativo"),
    senha: formData.get("senha"),
  });
}

export async function criarUsuario(formData: FormData) {
  await requirePapel("ADMIN");
  const parsed = parseFormData(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }
  if (!parsed.data.senha) {
    return { error: "Informe uma senha para o novo usuário." };
  }
  const senhaHash = await bcrypt.hash(parsed.data.senha, 10);
  await prisma.user.create({
    data: {
      nome: parsed.data.nome,
      email: parsed.data.email,
      papel: parsed.data.papel,
      ativo: parsed.data.ativo,
      senhaHash,
    },
  });
  revalidatePath("/contatos/usuarios");
  return {};
}

export async function atualizarUsuario(id: string, formData: FormData) {
  await requirePapel("ADMIN");
  const parsed = parseFormData(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }
  const { senha, ...rest } = parsed.data;
  await prisma.user.update({
    where: { id },
    data: {
      ...rest,
      ...(senha ? { senhaHash: await bcrypt.hash(senha, 10) } : {}),
    },
  });
  revalidatePath("/contatos/usuarios");
  return {};
}

export async function excluirUsuario(id: string) {
  await requirePapel("ADMIN");
  await prisma.user.update({ where: { id }, data: { ativo: false } });
  revalidatePath("/contatos/usuarios");
  return {};
}
