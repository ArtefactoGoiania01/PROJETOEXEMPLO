import { defineCloudflareConfig } from "@opennextjs/cloudflare";

const config = defineCloudflareConfig();

// O `pg` (driver do Prisma adapter-pg) faz `require("pg-cloudflare")`
// condicionalmente ao runtime workerd. O tracing padrão do Next.js só
// copia a variante "default" (vazia) desse pacote, então forçamos um
// `npm install` real do pacote dentro do bundle da função para garantir
// que `dist/index.js` (a implementação real, usada em workerd) exista.
config.default.install = {
  packages: ["pg-cloudflare"],
};

export default config;
