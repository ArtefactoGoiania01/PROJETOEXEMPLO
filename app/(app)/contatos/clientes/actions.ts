"use server";

import { revalidatePath } from "next/cache";

import { clientes, novoId } from "@/lib/mock-data";
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
  if (!logradouro && !cidade && !estado && !cep) return null;
  return { logradouro, cidade, estado, cep };
}

export async function criarCliente(formData: FormData) {
  const parsed = parseFormData(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }
  const { logradouro, cidade, estado, cep, ...rest } = parsed.data;
  clientes.push({
    id: novoId("cliente"),
    nome: rest.nome,
    telefone: rest.telefone ?? null,
    whatsapp: rest.whatsapp ?? null,
    email: rest.email ?? null,
    documento: rest.documento ?? null,
    obs: rest.obs ?? null,
    endereco: montarEndereco({ logradouro, cidade, estado, cep }),
    deletedAt: null,
  });
  revalidatePath("/contatos/clientes");
  return {};
}

export async function atualizarCliente(id: string, formData: FormData) {
  const parsed = parseFormData(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }
  const { logradouro, cidade, estado, cep, ...rest } = parsed.data;
  const item = clientes.find((c) => c.id === id);
  if (item) {
    item.nome = rest.nome;
    item.telefone = rest.telefone ?? null;
    item.whatsapp = rest.whatsapp ?? null;
    item.email = rest.email ?? null;
    item.documento = rest.documento ?? null;
    item.obs = rest.obs ?? null;
    item.endereco = montarEndereco({ logradouro, cidade, estado, cep });
  }
  revalidatePath("/contatos/clientes");
  return {};
}

export async function excluirCliente(id: string) {
  const item = clientes.find((c) => c.id === id);
  if (item) item.deletedAt = new Date();
  revalidatePath("/contatos/clientes");
  return {};
}
