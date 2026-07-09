# CRM de Vendas & Orçamentos — Móveis

CRM self-hosted de vendas e orçamentação para uma empresa de móveis de alto
padrão: funil de vendas (Kanban), ficha de negócio, orçamentos versionados e
catálogo de produtos. Interface e domínio em Português (Brasil).

> Este repositório está sendo construído em 4 etapas (ver `CLAUDE.md`).
> **Etapa 1 — Fundação e Cadastros Base** está implementada nesta versão:
> autenticação, schema completo do banco, layout global e CRUD de contatos.
> As demais telas (funil, negócio, orçamento, catálogo, agenda, relatórios,
> configurações) aparecem como "Em construção" até suas respectivas etapas.

## Stack

Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · componentes estilo
shadcn/ui · PostgreSQL · Prisma 6 · Auth.js (NextAuth v5) · Zod · Vitest ·
Playwright · Docker Compose.

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
para `/negocios` (ou para `/login`, se não autenticado).

### Login (usuários de seed, senha `123456`)

| E-mail | Papel |
| --- | --- |
| `admin@artefactogoiania.com` | Admin |
| `eunice.martins@artefactogoiania.com` | Vendedor (EUNICE MARTINS) |
| `natanael.santos@artefactogoiania.com` | Assistente (NATANAEL SANTOS) |

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
```

## Estrutura

Veja `CLAUDE.md` para o mapa completo de pastas, convenções e decisões
técnicas registradas.

## CI

`.github/workflows/ci.yml` roda lint, typecheck, testes unitários e build a
cada push/PR, com um serviço Postgres para aplicar as migrations.
