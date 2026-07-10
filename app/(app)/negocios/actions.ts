"use server";

import { revalidatePath } from "next/cache";

import { getPrisma } from "@/lib/db";

export async function moverEtapaNegocio(negocioId: string, etapaId: string) {
  const prisma = await getPrisma();
  await prisma.negocio.update({ where: { id: negocioId }, data: { etapaId } });
  await prisma.timelineEvent.create({
    data: {
      negocioId,
      tipo: "LOG",
      payload: { mensagem: "Negócio movido de etapa no funil" },
    },
  });
  revalidatePath("/negocios");
  return {};
}

export async function marcarVendido(negocioId: string) {
  const prisma = await getPrisma();
  await prisma.negocio.update({
    where: { id: negocioId },
    data: { status: "VENDIDO" },
  });
  await prisma.timelineEvent.create({
    data: {
      negocioId,
      tipo: "LOG",
      payload: { mensagem: "Negócio marcado como Vendido" },
    },
  });
  revalidatePath("/negocios");
  return {};
}

export async function marcarCancelado(negocioId: string, motivoPerdaId: string) {
  if (!motivoPerdaId) {
    return { error: "Selecione um motivo de perda." };
  }
  const prisma = await getPrisma();
  await prisma.negocio.update({
    where: { id: negocioId },
    data: { status: "CANCELADO", motivoPerdaId },
  });
  await prisma.timelineEvent.create({
    data: {
      negocioId,
      tipo: "LOG",
      payload: { mensagem: "Negócio marcado como Cancelado" },
    },
  });
  revalidatePath("/negocios");
  return {};
}
