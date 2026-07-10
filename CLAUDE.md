# CLAUDE.md

Guia de convenções e mapa do projeto para o CRM de Vendas & Orçamentos (Móveis).
Atualize este arquivo a cada etapa concluída do PROMPT MESTRE.

## Stack

- Next.js 16 (App Router) + TypeScript strict
- Tailwind CSS v4 + componentes shadcn/ui escritos manualmente em `components/ui`
  (o CLI oficial `shadcn` não pode ser usado neste ambiente — `ui.shadcn.com` é
  bloqueado pela política de rede — por isso os componentes foram portados à mão
  a partir dos padrões do shadcn/ui: Radix + CVA + Tailwind)
- PostgreSQL + Prisma 6 (`prisma-client-js`) via **driver adapter** (`@prisma/adapter-pg`),
  para o mesmo client funcionar tanto em Node.js (engine local) quanto em
  Cloudflare Workers (via Hyperdrive, sem engine binário)
- Auth.js (NextAuth v5 beta) com Credentials Provider + RBAC por papel
- Zod em todas as fronteiras (Server Actions)
- Vitest (unit) + Playwright (E2E, a partir da Etapa 2)
- Deploy: Docker Compose (app + Postgres) **ou** Cloudflare Workers via
  `@opennextjs/cloudflare` (ver seção "Deploy no Cloudflare Workers" abaixo)

## Comandos

```bash
npm run dev          # servidor de desenvolvimento (Turbopack)
npm run build        # build de produção
npm run start         # inicia o build de produção
npm run lint          # ESLint
npm run typecheck     # tsc --noEmit
npm run test          # Vitest (unit)
npm run format        # Prettier --write

npm run db:migrate    # prisma migrate dev
npm run db:deploy     # prisma migrate deploy (produção/CI)
npm run db:seed       # popula o banco (prisma/seed.ts)
npm run db:studio     # Prisma Studio
npm run db:generate   # prisma generate

docker compose up --build   # sobe Postgres + app

npm run cf:build      # build do Worker (@opennextjs/cloudflare)
npm run cf:preview    # build + `wrangler dev` local simulando o Worker
npm run cf:deploy     # build + `wrangler deploy` (Cloudflare Workers)
```

### Setup local sem Docker

1. `cp .env.example .env` e ajuste `DATABASE_URL` se necessário.
2. Suba um Postgres local (ou use `docker compose up db`).
3. `npm install`
4. `npm run db:migrate` (cria o schema)
5. `npm run db:seed` (popula usuários, funil, clientes e negócios de exemplo)
6. `npm run dev`

### Usuários de seed (senha `123456`)

- `admin@artefactogoiania.com` — Admin
- `eunice.martins@artefactogoiania.com` — Vendedor (EUNICE MARTINS)
- `natanael.santos@artefactogoiania.com` — Assistente (NATANAEL SANTOS)

## Mapa do projeto

```
/app
  /(auth)/login              → tela de login (Server Action em actions.ts)
  /(app)/layout.tsx           → shell global (sidebar + topbar) + guarda de
                                  sessão (redireciona para /login se não
                                  autenticado — ver "Convenções" sobre por que
                                  isso não é feito em middleware/proxy.ts)
  /(app)/negocios             → funil de vendas (placeholder até a Etapa 2)
    /orcamentos, /lista, /sem-acompanhamento, /motivos-perda, /vendedores,
    /margem-lucro, /cupons, /pedidos-compra, /lixeira, /banco-mensagens,
    /formas-pagamento         → submenu de Negócios (placeholders — Etapas 2-4)
  /(app)/contatos              → CRUD funcionais (Etapa 1)
    /clientes, /especificadores, /escritorios, /construtoras,
    /fabricantes, /categorias, /usuarios
  /(app)/arquivos, /agenda, /relatorios, /captacao, /produtos, /exportacao
                               → placeholders (Etapas 2-4)
  /api/auth/[...nextauth]     → rota do Auth.js

/components
  /ui                          → primitivos estilo shadcn/ui (Radix + CVA)
  /layout                      → sidebar, topbar, submenus, nav-config
  /contatos/entity-manager.tsx → tabela + dialog de CRUD genérico e reutilizável
                                  entre todas as entidades de cadastro simples

/lib
  auth.ts (raiz), auth.config.ts (raiz) → configuração do Auth.js
  db.ts                         → getPrisma(): resolve o client certo por
                                   runtime (Node engine local vs. Cloudflare
                                   Hyperdrive via driver adapter)
  rbac.ts                       → requireSession / requirePapel
  labels/pt-BR.ts               → labels e formatação (moeda, data) centralizados
  validators/contatos.ts        → schemas Zod dos cadastros

/prisma
  schema.prisma                 → schema completo (todas as entidades da Seção 4
                                   do PROMPT MESTRE já modeladas, mesmo as usadas
                                   apenas em etapas futuras)
  seed.ts                       → seed de usuários, funil VENDAS (7 etapas),
                                   clientes/especificadores/escritórios e negócios

/tests                          → Vitest (unit)
wrangler.jsonc, open-next.config.ts → config do deploy em Cloudflare Workers
```

## Convenções

- Todo texto de UI do domínio (labels, enums, formatação de moeda/data) fica em
  `lib/labels/pt-BR.ts`. Não hardcode strings de domínio nos componentes.
- Toda mutação passa por Server Action (`"use server"`) validada com Zod.
- Componentes Server (páginas) buscam dados via Prisma e passam **dados já
  serializáveis** (nunca funções) para Client Components — por isso o
  `EntityManager` recebe `items` com `formValues` e `cells` pré-computados
  em vez de callbacks de renderização.
- Soft delete (`deletedAt`) é usado em `Cliente`, `Negocio`, `Orcamento` e
  `Produto`. `User` usa `ativo=false` como desativação (é referenciado por
  muitas FKs, não pode ser removido).
- RBAC: `lib/rbac.ts` expõe `requireSession()` e `requirePapel(...papeis)`.
  Gestão de usuários (`/contatos/usuarios`) exige papel `ADMIN`.
- Next.js 16 não usa mais `next/font/google` sem risco de dependência de rede
  neste ambiente — o layout usa a pilha de fontes padrão do sistema
  (`font-sans` do Tailwind).
- **Não existe `middleware.ts`/`proxy.ts`.** O Next.js 16 trocou a convenção
  `middleware.ts` por `proxy.ts`, mas essa nova convenção só roda em runtime
  Node.js (não aceita mais `runtime: "edge"`), o que é incompatível com o
  adapter `@opennextjs/cloudflare` (exige middleware em Edge). Por isso a
  proteção de rotas de `(app)` foi movida para `app/(app)/layout.tsx`
  (Server Component, roda em qualquer runtime suportado por ambos os
  targets de deploy).
- `lib/db.ts` exporta `getPrisma()` (assíncrono) em vez de um `prisma`
  singleton — toda página/Server Action precisa de `const prisma = await
  getPrisma();`. Isso existe porque em Cloudflare Workers o binding do
  Hyperdrive só existe no contexto da requisição (não há `process.env`
  nem client reaproveitável entre requisições como em Node).

## Decisões técnicas registradas

- **Prisma 6.19 (não 7)**: a v7 mudou o generator (`prisma-client` com output
  custom + `prisma.config.ts`) e ainda está em adoção recente; fixamos a v6
  estável para reduzir risco de instabilidade na fundação do projeto.
- **shadcn/ui portado manualmente**: `ui.shadcn.com` está bloqueado pela
  política de rede deste ambiente (`npx shadcn init` falha). Os componentes em
  `components/ui` foram escritos à mão seguindo exatamente os padrões oficiais
  do shadcn/ui (Radix UI + `class-variance-authority` + Tailwind), então
  `npx shadcn@latest add <componente>` deve funcionar normalmente em um
  ambiente com acesso à internet liberado, caso desejado no futuro.
- **Dockerfile mantém `node_modules` completo** (em vez de `output: "standalone"`)
  para que `prisma migrate deploy` rode no `CMD` do container sem precisar de
  um estágio/imagem adicional só para o CLI do Prisma.
- **`@prisma/adapter-pg` em vez do engine padrão do Prisma**: necessário para
  o mesmo `PrismaClient` funcionar tanto em Node.js (Docker) quanto em
  Cloudflare Workers, que não tem filesystem para o engine binário do Prisma.
  Não é preview feature no Prisma 6.19 (já estável).
- **`pg-cloudflare` como dependência direta**: o `open-next.config.ts` força
  reinstalação real desse pacote dentro do bundle da função
  (`default.install.packages`), porque o tracing padrão do Next só copia a
  variante vazia (`dist/empty.js`) do pacote — a variante real para o
  runtime `workerd` (`dist/index.js`) fica atrás de uma export condition que
  o tracer não resolve sozinho.

## Deploy no Cloudflare Workers

Alternativa ao Docker, usando [OpenNext](https://opennext.js.org/cloudflare)
+ [Hyperdrive](https://developers.cloudflare.com/hyperdrive/) (proxy de
conexão do Cloudflare para bancos Postgres tradicionais, incluindo o mesmo
Postgres usado no Docker Compose).

**Passos únicos de configuração (feitos uma vez, no dashboard/CLI da Cloudflare):**

```bash
npx wrangler login

# Cria o binding Hyperdrive apontando para o Postgres real (precisa ser
# acessível pela internet — não funciona com um Postgres só em localhost).
npx wrangler hyperdrive create crm-moveis-db \
  --connection-string="postgresql://usuario:senha@host:5432/crm_moveis"
# copie o "id" retornado e cole em wrangler.jsonc no lugar de
# "REPLACE_WITH_HYPERDRIVE_ID"

# AUTH_SECRET é sensível — não vai em wrangler.jsonc, e sim como secret:
npx wrangler secret put AUTH_SECRET
# (cole um valor gerado com `openssl rand -base64 32`)
```

Ajuste também `NEXTAUTH_URL` em `wrangler.jsonc` (`vars`) para a URL real do
Worker (ou domínio customizado), e o `name` do Worker se for diferente de
`exemplo01`.

**Deploy:**

```bash
npm run cf:deploy
```

Isso builda o Next.js normalmente, empacota com `@opennextjs/cloudflare` e
publica via `wrangler deploy`. Rode as migrations contra o mesmo Postgres
antes do primeiro deploy (`DATABASE_URL=... npx prisma migrate deploy`, a
partir de qualquer máquina com acesso à internet ao banco — o runtime do
Worker em si não roda migrations).

**Limitações conhecidas desta etapa no runtime Cloudflare** (não bloqueiam o
deploy, mas ainda não foram adaptadas):
- Upload de arquivos (`/uploads`) usa disco local — não existe em Workers.
  Isso só vira relevante a partir da Etapa 3 (imagens de produto);
  quando chegar lá, vai precisar de um bucket R2.
- Não testado contra uma instância real da Cloudflare nesta sessão (sem
  credenciais); validado localmente via `npm run cf:build` +
  `wrangler deploy --dry-run`, que confirmam bundle e bindings corretos.

## Próximas etapas (não implementadas ainda)

- **Etapa 2**: Kanban do funil de vendas, ficha do negócio, atividades/notas/
  anexos/timeline, ações Vendido/Cancelado, Negócios em lista/Sem acompanhamento.
- **Etapa 3**: Editor de orçamento versionado, catálogo de produtos com imagens,
  importação via Excel, geração de PDF, Pedidos de compra.
- **Etapa 4**: Agenda global, Relatórios, Configurações (formas de pagamento,
  banco de mensagens, motivos de perda, cupons), Lixeira, Captação de clientes,
  Exportação de dados.
