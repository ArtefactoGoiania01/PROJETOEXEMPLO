import { auth } from "@/auth";

export type Papel = "VENDEDOR" | "ASSISTENTE" | "ADMIN";

export async function requireSession() {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Não autenticado.");
  }
  return session;
}

export async function requirePapel(...papeis: Papel[]) {
  const session = await requireSession();
  if (!papeis.includes(session.user.papel as Papel)) {
    throw new Error("Você não tem permissão para executar esta ação.");
  }
  return session;
}
