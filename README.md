# CRM de Vendas & Orçamentos — Móveis

CRM self-hosted de vendas e orçamentação para uma empresa de móveis de alto
padrão: funil de vendas (Kanban), ficha de negócio, orçamentos versionados e
catálogo de produtos. Interface e domínio em Português (Brasil).

> Este repositório está sendo construído em 4 etapas (ver `CLAUDE.md`).
> **Etapa 1 — Fundação e Cadastros Base** está implementada nesta versão:
> schema completo do banco, layout global e CRUD de contatos. As demais
> telas (funil, negócio, orçamento, catálogo, agenda, relatórios,
> configurações) aparecem como "Em construção" até suas respectivas etapas.
>
> **Sem autenticação:** este é um deploy de exemplo sem banco de dados
> hospedado, então o login foi removido — o app inteiro é público.

## Stack

Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · componentes estilo
shadcn/ui · PostgreSQL · Prisma 6 (driver adapter `@prisma/adapter-pg`) ·
Zod · Vitest · Playwright · Docker Compose ou Cloudflare Workers
(`@opennextjs/cloudflare` + Hyperdrive).

## Como rodar

### Opção 1 — Docker Compose (recomendado)

```bash
docker compose up --build
```

Isso sobe o Postgres e a aplicação. Após o primeiro `up`, rode as migrations
e o seed dentro do container da aplicação:

```bash
docker compose exec app npx prisma migrate deploy
docker compose exec app npm run db:seed
```

Acesse [http://localhost:3000](http://localhost:3000).

### Opção 2 — Local (sem Docker)

Pré-requisitos: Node.js 22+, PostgreSQL 16 rodando localmente.

```bash
cp .env.example .env
# ajuste DATABASE_URL em .env se necessário

npm install
npm run db:migrate   # cria o schema (prisma migrate dev)
npm run db:seed      # popula usuários, funil de vendas e negócios de exemplo
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000) — a rota raiz redireciona
para `/negocios` direto, sem login.

### Opção 3 — Cloudflare Workers

```bash
npm run cf:deploy
```

Por padrão sobe **sem banco de dados** — o app carrega normalmente, mas
telas que dependem de dados (Contatos etc.) falham até um Postgres real
ser conectado. Para ligar um Postgres real depois, veja `CLAUDE.md` →
"Deploy no Cloudflare Workers" (envolve `wrangler hyperdrive create` +
descomentar um bloco em `wrangler.jsonc`).

## Scripts

```bash
npm run dev          # ambiente de desenvolvimento
npm run build         # build de produção
npm run start          # inicia o build de produção
npm run lint            # ESLint
npm run typecheck       # tsc --noEmit
npm run test             # Vitest (unit)
npm run format           # Prettier

npm run db:migrate    # prisma migrate dev
npm run db:deploy     # prisma migrate deploy
npm run db:seed       # prisma/seed.ts
npm run db:studio     # Prisma Studio

npm run cf:build      # build do Worker (Cloudflare)
npm run cf:preview    # build + wrangler dev local
npm run cf:deploy     # build + wrangler deploy
```

## Estrutura

Veja `CLAUDE.md` para o mapa completo de pastas, convenções e decisões
técnicas registradas.

## CI

`.github/workflows/ci.yml` roda lint, typecheck, testes unitários e build a
cada push/PR, com um serviço Postgres para aplicar as migrations.
