"use server";

import { revalidatePath } from "next/cache";

import { getPrisma } from "@/lib/db";
import { requireSession } from "@/lib/rbac";
import { clienteSchema } from "@/lib/validators/contatos";

function parseFormData(formData: FormData) {
  return clienteSchema.safeParse({
    nome: formData.get("nome"),
    telefone: formData.get("telefone"),
    whatsapp: formData.get("whatsapp"),
    email: formData.get("email"),
    documento: formData.get("documento"),
    logradouro: formData.get("logradouro"),
    cidade: formData.get("cidade"),
    estado: formData.get("estado"),
    cep: formData.get("cep"),
    obs: formData.get("obs"),
  });
}

function montarEndereco(data: {
  logradouro?: string;
  cidade?: string;
  estado?: string;
  cep?: string;
}) {
  const { logradouro, cidade, estado, cep } = data;
  if (!logradouro && !cidade && !estado && !cep) return undefined;
  return { logradouro, cidade, estado, cep };
}

export async function criarCliente(formData: FormData) {
  await requireSession();
  const parsed = parseFormData(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }
  const { logradouro, cidade, estado, cep, ...rest } = parsed.data;
  const prisma = await getPrisma();
  await prisma.cliente.create({
    data: { ...rest, endereco: montarEndereco({ logradouro, cidade, estado, cep }) },
  });
  revalidatePath("/contatos/clientes");
  return {};
}

export async function atualizarCliente(id: string, formData: FormData) {
  await requireSession();
  const parsed = parseFormData(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }
  const { logradouro, cidade, estado, cep, ...rest } = parsed.data;
  const prisma = await getPrisma();
  await prisma.cliente.update({
    where: { id },
    data: { ...rest, endereco: montarEndereco({ logradouro, cidade, estado, cep }) },
  });
  revalidatePath("/contatos/clientes");
  return {};
}

export async function excluirCliente(id: string) {
  await requireSession();
  const prisma = await getPrisma();
  await prisma.cliente.update({ where: { id }, data: { deletedAt: new Date() } });
  revalidatePath("/contatos/clientes");
  return {};
}
