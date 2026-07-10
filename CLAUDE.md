# CLAUDE.md

Guia de convenções e mapa do projeto para o CRM de Vendas & Orçamentos (Móveis).

> **Desvio deliberado do PROMPT MESTRE:** este é um software de teste/exemplo,
> sem banco de dados hospedado. A pedido explícito do usuário, o app **não
> usa PostgreSQL/Prisma nem autenticação** — todos os dados vivem em memória
> (`lib/mock-data.ts`) e são recriados a cada início de processo. Isso troca
> persistência real por simplicidade: zero infraestrutura para rodar em
> qualquer lugar (Docker, Cloudflare Workers) sem configurar nada.
> Se este projeto evoluir para uso real, isso precisa ser revertido para um
> banco de verdade (o schema de referência ficou registrado no histórico
> do git, commit anterior a esta mudança).

## Stack

- Next.js 16 (App Router) + TypeScript strict
- Tailwind CSS v4 + componentes shadcn/ui escritos manualmente em `components/ui`
  (o CLI oficial `shadcn` não pode ser usado neste ambiente — `ui.shadcn.com` é
  bloqueado pela política de rede — por isso os componentes foram portados à mão
  a partir dos padrões do shadcn/ui: Radix + CVA + Tailwind)
- Dados em memória (`lib/mock-data.ts`) — sem banco de dados
- Zod em todas as fronteiras (Server Actions)
- Vitest (unit)
- Deploy: Docker **ou** Cloudflare Workers via `@opennextjs/cloudflare`

## Comandos

```bash
npm run dev          # servidor de desenvolvimento (Turbopack)
npm run build        # build de produção
npm run start         # inicia o build de produção
npm run lint          # ESLint
npm run typecheck     # tsc --noEmit
npm run test          # Vitest (unit)
npm run format        # Prettier --write

docker compose up --build   # sobe o app (sem banco)

npm run cf:build      # build do Worker (@opennextjs/cloudflare)
npm run cf:preview    # build + `wrangler dev` local simulando o Worker
npm run cf:deploy     # build + `wrangler deploy` (Cloudflare Workers)
```

### Setup local

```bash
npm install
npm run dev
```

Acesse `http://localhost:3000` — entra direto no funil de vendas, sem
login e sem precisar de banco. Os dados de exemplo (clientes, negócios,
usuários) já vêm carregados em `lib/mock-data.ts`.

## Mapa do projeto

```
/app
  /(app)/layout.tsx           → shell global: sidebar de ícones + topbar
                                  (`export const dynamic = "force-dynamic"`
                                  para as páginas sempre lerem o estado
                                  atual do mock-data)
  /(app)/negocios              → Funil (Kanban) — Etapa 2, versão simplificada
    /lista                     → tabela de todos os negócios
    /sem-acompanhamento        → negócios abertos sem atividade
    /orcamentos                → lista de orçamentos (Etapa 3)
    /[id]/orcamento            → editor de orçamento simplificado (Etapa 3)
    /motivos-perda, /vendedores, /margem-lucro, /cupons, /pedidos-compra,
    /lixeira, /banco-mensagens, /formas-pagamento
                               → submenu de Negócios (placeholders — Etapa 4)
  /(app)/contatos              → CRUD funcionais (Etapa 1)
    /clientes, /especificadores, /escritorios, /construtoras,
    /fabricantes, /categorias, /usuarios
  /(app)/produtos              → catálogo de produtos, CRUD simples (Etapa 3)
  /(app)/arquivos, /agenda, /relatorios, /captacao, /exportacao
                               → placeholders (Etapa 4)

/components
  /ui                          → primitivos estilo shadcn/ui (Radix + CVA)
  /layout                      → sidebar, topbar, submenus, nav-config
  /contatos/entity-manager.tsx → tabela + dialog de CRUD genérico e reutilizável
                                  entre todas as entidades de cadastro simples
                                  (reaproveitado por Produtos)
  /negocios/kanban-board.tsx   → board com @dnd-kit (drag-and-drop entre
                                  etapas); kanban-board-client.tsx carrega
                                  sem SSR (dnd-kit gera ids que divergem
                                  entre servidor/cliente e quebram hidratação)
  /negocios/negocio-detail-dialog.tsx → ficha simplificada do negócio
                                  (dados principais, botão "Abrir negócio"
                                  → editor de orçamento, Vendido/Cancelado)
  /negocios/itens-orcamento.tsx → tabela de itens do orçamento + dialog de
                                  adicionar produto (autofill a partir do
                                  catálogo ou item avulso)

/lib
  mock-data.ts                  → todos os "dados" do app: arrays mutáveis
                                   em memória (clientes, negócios, usuários,
                                   etapas do funil, motivos de perda, produtos,
                                   orçamentos etc.)
  labels/pt-BR.ts               → labels e formatação (moeda, data) centralizados
  validators/contatos.ts        → schemas Zod dos cadastros
  validators/produtos.ts        → schemas Zod de produto e item de orçamento

/tests                          → Vitest (unit)
wrangler.jsonc, open-next.config.ts → config do deploy em Cloudflare Workers
```

## Convenções

- Todo texto de UI do domínio (labels, enums, formatação de moeda/data) fica em
  `lib/labels/pt-BR.ts`. Não hardcode strings de domínio nos componentes.
- Toda mutação passa por Server Action (`"use server"`) validada com Zod.
- Componentes Server (páginas) passam **dados já serializáveis** (nunca
  funções) para Client Components — por isso o `EntityManager` recebe
  `items` com `formValues` e `cells` pré-computados em vez de callbacks de
  renderização.
- `lib/mock-data.ts` exporta arrays mutáveis diretamente — Server Actions
  fazem `array.push(...)` / `array.find(...)` / `array.splice(...)` no
  lugar de chamadas ao banco. **Isso não persiste entre deploys nem,
  necessariamente, entre requisições em serverless** (cada isolate do
  Cloudflare Workers pode ter seu próprio módulo carregado) — é uma
  limitação aceita para este app de exemplo, não um bug.
- Next.js 16 não usa mais `next/font/google` sem risco de dependência de rede
  neste ambiente — o layout usa a pilha de fontes padrão do sistema
  (`font-sans` do Tailwind).

## Decisões técnicas registradas

- **Sem banco de dados e sem autenticação**: ver aviso no topo do arquivo.
  `app/(app)/layout.tsx` não faz nenhum controle de acesso; todas as rotas
  são públicas e todos os dados são mock em memória.
- **shadcn/ui portado manualmente**: `ui.shadcn.com` está bloqueado pela
  política de rede deste ambiente (`npx shadcn init` falha). Os componentes em
  `components/ui` foram escritos à mão seguindo exatamente os padrões oficiais
  do shadcn/ui (Radix UI + `class-variance-authority` + Tailwind), então
  `npx shadcn@latest add <componente>` deve funcionar normalmente em um
  ambiente com acesso à internet liberado, caso desejado no futuro.

## Deploy no Cloudflare Workers

Usando [OpenNext](https://opennext.js.org/cloudflare). Como não há banco de
dados, não existe nenhuma configuração adicional necessária (sem secrets,
sem bindings) — `npm run cf:deploy` builda e publica direto.

## Etapa 2 — versão simplificada (a pedido do usuário)

A pedido explícito do usuário, a Etapa 2 foi implementada de forma
enxuta/visual — este é um software de teste, não precisa da complexidade
completa do PROMPT MESTRE. Implementado:

- Kanban do funil (`/negocios`) com drag-and-drop entre etapas (@dnd-kit),
  totais por coluna, cards com dados do negócio.
- Clique no card abre uma ficha simplificada (dados principais + botões
  Vendido / Cancelado com seleção de motivo de perda).
- `/negocios/lista` e `/negocios/sem-acompanhamento`.

**Não implementado nesta etapa** (fora de escopo por decisão de produto,
não por limitação técnica): atividades/notas/anexos, timeline com filtros,
mini-calendário, abas "Venda Realizada"/"Venda Cancelada", busca/filtro de
cartões (a busca no topo é só visual), badge de atividade real (todo card
mostra "Sem atividades" fixo, já que não há tela de criar atividade ainda).

## Etapa 3 — versão simplificada (a pedido do usuário)

Mesma diretriz da Etapa 2: implementação enxuta, sem a complexidade
completa do PROMPT MESTRE. Implementado:

- Catálogo de Produtos (`/produtos`): CRUD simples (nome, categoria,
  fabricante, valor unitário, unidade, descrição), reaproveitando o
  `EntityManager` genérico da Etapa 1.
- Editor de Orçamento (`/negocios/[id]/orcamento`), acessível pelo botão
  "Abrir negócio" na ficha do Kanban: Dados Gerais (cliente, responsável,
  especificador, escritório, RT) + tabela de itens. "Adicionar Produto"
  abre um dialog que autopreenche descrição/preço ao escolher um item do
  catálogo (ou aceita um item avulso). Total do orçamento sincroniza com o
  `valor` do negócio (reflete no Kanban e nas listas).
- `/negocios/orcamentos`: lista de orçamentos com link para cada um.

**Não implementado nesta etapa** (fora de escopo por decisão de produto):
versionamento de orçamento, abas Status/Produtos removidos/Inserir por
Excel, geração de PDF, Pedido de compra, upload de imagens de produto
(Detalhes/Imagens/Ambientação/Componentes do modal completo da Seção 6.6-6.7
do PROMPT MESTRE), duplicar/substituir item.

## Próximas etapas (não implementadas ainda)

- **Etapa 4**: Agenda global, Relatórios, Configurações (formas de pagamento,
  banco de mensagens, motivos de perda, cupons), Lixeira, Captação de clientes,
  Exportação de dados.
