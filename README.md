# CRM de Vendas & Orçamentos — Móveis

CRM de exemplo de vendas e orçamentação para uma empresa de móveis de alto
padrão: funil de vendas (Kanban), ficha de negócio e catálogo de produtos.
Interface e domínio em Português (Brasil).

> Este repositório está sendo construído em etapas (ver `CLAUDE.md`).
> **Etapa 1 — Cadastros Base** e **Etapa 2 — Funil (Kanban), versão
> simplificada** estão implementadas. As demais telas aparecem como
> "Em construção".
>
> **Sem banco de dados e sem login:** este é um app de teste/exemplo — todos
> os dados vivem em memória (`lib/mock-data.ts`), recriados a cada início do
> processo. Não precisa de Postgres, Docker com banco, nem nenhuma
> configuração para rodar.

## Stack

Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · componentes estilo
shadcn/ui · Zod · Vitest · Docker ou Cloudflare Workers
(`@opennextjs/cloudflare`).

## Como rodar

### Local

```bash
npm install
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000) — entra direto no
funil de vendas.

### Docker

```bash
docker compose up --build
```

### Cloudflare Workers

```bash
npm run cf:deploy
```

Sem passos extras — não há banco para configurar.

## Scripts

```bash
npm run dev          # ambiente de desenvolvimento
npm run build         # build de produção
npm run start          # inicia o build de produção
npm run lint            # ESLint
npm run typecheck       # tsc --noEmit
npm run test             # Vitest (unit)
npm run format           # Prettier

npm run cf:build      # build do Worker (Cloudflare)
npm run cf:preview    # build + wrangler dev local
npm run cf:deploy     # build + wrangler deploy
```

## Estrutura

Veja `CLAUDE.md` para o mapa completo de pastas, convenções e decisões
técnicas registradas.

## CI

`.github/workflows/ci.yml` roda lint, typecheck, testes unitários e build
(Node e Cloudflare) a cada push/PR.
