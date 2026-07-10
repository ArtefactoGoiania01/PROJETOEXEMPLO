import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createNodeClient() {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

/**
 * Resolve a conexão do Hyperdrive quando rodando como Cloudflare Worker
 * (via @opennextjs/cloudflare). Fora desse runtime (Node/Docker), o import
 * dinâmico falha silenciosamente e caímos para DATABASE_URL local.
 */
async function createEdgeClient(): Promise<PrismaClient | undefined> {
  try {
    const { getCloudflareContext } = await import("@opennextjs/cloudflare");
    const { env } = await getCloudflareContext({ async: true });
    const hyperdrive = (env as Record<string, unknown>).HYPERDRIVE as
      | { connectionString: string }
      | undefined;
    if (!hyperdrive) return undefined;

    const adapter = new PrismaPg({ connectionString: hyperdrive.connectionString });
    return new PrismaClient({ adapter });
  } catch {
    return undefined;
  }
}

/**
 * Retorna o PrismaClient correto para o runtime atual.
 * - Cloudflare Workers: cria um client novo por chamada usando o binding
 *   Hyperdrive (não há `process.env.DATABASE_URL` nem filesystem persistente
 *   nesse runtime, e o binding só existe no contexto da requisição).
 * - Node.js (dev local / Docker): reaproveita um client singleton conectado
 *   via `DATABASE_URL`.
 */
export async function getPrisma(): Promise<PrismaClient> {
  const edgeClient = await createEdgeClient();
  if (edgeClient) return edgeClient;

  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = createNodeClient();
  }
  return globalForPrisma.prisma;
}
