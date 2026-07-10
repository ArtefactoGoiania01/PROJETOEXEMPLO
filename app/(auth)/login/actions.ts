"use server";

import { AuthError } from "next-auth";
import { z } from "zod";

import { signIn, BancoIndisponivelError } from "@/auth";

const loginSchema = z.object({
  email: z.string().email("Informe um e-mail válido."),
  senha: z.string().min(1, "Informe a senha."),
});

export type LoginState = {
  error?: string;
};

export async function loginAction(
  _prevState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    senha: formData.get("senha"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  try {
    await signIn("credentials", {
      email: parsed.data.email,
      senha: parsed.data.senha,
      redirectTo: "/negocios",
    });
    return {};
  } catch (error) {
    if (error instanceof BancoIndisponivelError) {
      return {
        error:
          "Banco de dados não configurado neste ambiente. Configure a conexão (ver README) para habilitar o login.",
      };
    }
    if (error instanceof AuthError) {
      return { error: "E-mail ou senha inválidos." };
    }
    throw error;
  }
}
