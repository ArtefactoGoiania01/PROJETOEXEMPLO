"use server";

import { revalidatePath } from "next/cache";

import { negocios } from "@/lib/mock-data";

export async function moverEtapaNegocio(negocioId: string, etapaId: string) {
  const negocio = negocios.find((n) => n.id === negocioId);
  if (negocio) negocio.etapaId = etapaId;
  revalidatePath("/negocios");
  return {};
}

export async function marcarVendido(negocioId: string) {
  const negocio = negocios.find((n) => n.id === negocioId);
  if (negocio) negocio.status = "VENDIDO";
  revalidatePath("/negocios");
  return {};
}

export async function marcarCancelado(negocioId: string, motivoPerdaId: string) {
  if (!motivoPerdaId) {
    return { error: "Selecione um motivo de perda." };
  }
  const negocio = negocios.find((n) => n.id === negocioId);
  if (negocio) {
    negocio.status = "CANCELADO";
    negocio.motivoPerdaId = motivoPerdaId;
  }
  revalidatePath("/negocios");
  return {};
}
