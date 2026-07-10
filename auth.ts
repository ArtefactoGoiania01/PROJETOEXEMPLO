import NextAuth, { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { z } from "zod";

import { authConfig } from "@/auth.config";
import { getPrisma } from "@/lib/db";

const credenciaisSchema = z.object({
  email: z.string().email(),
  senha: z.string().min(1),
});

export class BancoIndisponivelError extends CredentialsSignin {
  code = "banco_indisponivel";
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "E-mail", type: "email" },
        senha: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        const parsed = credenciaisSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const { email, senha } = parsed.data;

        let user;
        try {
          const prisma = await getPrisma();
          user = await prisma.user.findUnique({ where: { email } });
        } catch (error) {
          // Banco não configurado/inacessível (ex.: deploy Cloudflare sem
          // Hyperdrive configurado ainda) — falha de forma legível em vez
          // de deixar o erro de conexão estourar cru para o usuário.
          console.error("Falha ao conectar ao banco de dados:", error);
          throw new BancoIndisponivelError();
        }

        if (!user || !user.ativo) return null;

        const senhaValida = await bcrypt.compare(senha, user.senhaHash);
        if (!senhaValida) return null;

        return {
          id: user.id,
          name: user.nome,
          email: user.email,
          papel: user.papel,
        };
      },
    }),
  ],
});
