"use server";

import { revalidatePath } from "next/cache";

import { usuarios, novoId } from "@/lib/mock-data";
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
  const parsed = parseFormData(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }
  if (!parsed.data.senha) {
    return { error: "Informe uma senha para o novo usuário." };
  }
  usuarios.push({
    id: novoId("user"),
    nome: parsed.data.nome,
    email: parsed.data.email,
    papel: parsed.data.papel,
    ativo: parsed.data.ativo,
    senhaHash: "",
  });
  revalidatePath("/contatos/usuarios");
  return {};
}

export async function atualizarUsuario(id: string, formData: FormData) {
  const parsed = parseFormData(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }
  const item = usuarios.find((u) => u.id === id);
  if (item) {
    item.nome = parsed.data.nome;
    item.email = parsed.data.email;
    item.papel = parsed.data.papel;
    item.ativo = parsed.data.ativo;
  }
  revalidatePath("/contatos/usuarios");
  return {};
}

export async function excluirUsuario(id: string) {
  const item = usuarios.find((u) => u.id === id);
  if (item) item.ativo = false;
  revalidatePath("/contatos/usuarios");
  return {};
}
