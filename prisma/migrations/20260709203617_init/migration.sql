-- CreateEnum
CREATE TYPE "PapelUsuario" AS ENUM ('VENDEDOR', 'ASSISTENTE', 'ADMIN');

-- CreateEnum
CREATE TYPE "PotencialVendas" AS ENUM ('ALTO', 'MEDIO', 'BAIXO');

-- CreateEnum
CREATE TYPE "StatusNegocio" AS ENUM ('ABERTO', 'VENDIDO', 'CANCELADO');

-- CreateEnum
CREATE TYPE "StatusAtividade" AS ENUM ('SEM_ATIVIDADES', 'PLANEJADA', 'ATRASADA', 'CONCLUIDA');

-- CreateEnum
CREATE TYPE "TipoTimelineEvent" AS ENUM ('ATIVIDADE', 'NOTA', 'IMAGEM', 'ARQUIVO', 'WHATSAPP', 'LOG', 'NOTA_INTERNA');

-- CreateEnum
CREATE TYPE "TipoImagemProduto" AS ENUM ('TECNICA', 'AMBIENTE');

-- CreateEnum
CREATE TYPE "StatusVersaoOrcamento" AS ENUM ('RASCUNHO', 'ENVIADO', 'APROVADO', 'REJEITADO');

-- CreateEnum
CREATE TYPE "StatusPedidoCompra" AS ENUM ('PENDENTE', 'CONFIRMADO', 'CANCELADO');

-- CreateEnum
CREATE TYPE "TipoCupom" AS ENUM ('PERCENTUAL', 'VALOR_FIXO');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senhaHash" TEXT NOT NULL,
    "papel" "PapelUsuario" NOT NULL DEFAULT 'VENDEDOR',
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clientes" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "telefone" TEXT,
    "whatsapp" TEXT,
    "email" TEXT,
    "documento" TEXT,
    "endereco" JSONB,
    "obs" TEXT,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "clientes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "escritorios" (
    "id" TEXT NOT NULL,
    "razaoSocial" TEXT NOT NULL,
    "nomeFantasia" TEXT,
    "documento" TEXT,
    "contato" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "escritorios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "especificadores" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "whatsapp" TEXT,
    "email" TEXT,
    "escritorioId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "especificadores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "construtoras" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "construtoras_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fabricantes" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "fabricantes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categorias_produto" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "categorias_produto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "funis" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "funis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "etapas_funil" (
    "id" TEXT NOT NULL,
    "funilId" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "ordem" INTEGER NOT NULL,
    "cor" TEXT NOT NULL DEFAULT '#64748b',

    CONSTRAINT "etapas_funil_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "motivos_perda" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "motivos_perda_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "etiquetas" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "cor" TEXT NOT NULL DEFAULT '#64748b',

    CONSTRAINT "etiquetas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "negocios" (
    "id" TEXT NOT NULL,
    "numero" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "clienteId" TEXT NOT NULL,
    "responsavelId" TEXT NOT NULL,
    "especificadorId" TEXT,
    "escritorioId" TEXT,
    "construtoraId" TEXT,
    "funilId" TEXT NOT NULL,
    "etapaId" TEXT NOT NULL,
    "valor" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "previsaoFechamento" DATE,
    "dataEntrega" DATE,
    "potencialVendas" "PotencialVendas",
    "referenciaExterna" TEXT,
    "origem" TEXT,
    "status" "StatusNegocio" NOT NULL DEFAULT 'ABERTO',
    "motivoPerdaId" TEXT,
    "codReferencia" TEXT,
    "inicio" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "negocios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "atividades" (
    "id" TEXT NOT NULL,
    "negocioId" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "tipoAtividade" TEXT NOT NULL,
    "data" DATE NOT NULL,
    "hora" TEXT,
    "duracao" TEXT,
    "descricao" TEXT,
    "status" "StatusAtividade" NOT NULL DEFAULT 'PLANEJADA',
    "participantes" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "atividades_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notas" (
    "id" TEXT NOT NULL,
    "negocioId" TEXT NOT NULL,
    "autorId" TEXT NOT NULL,
    "texto" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "anexos" (
    "id" TEXT NOT NULL,
    "negocioId" TEXT NOT NULL,
    "nomeArquivo" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "mime" TEXT,
    "tamanho" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "anexos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notas_internas" (
    "id" TEXT NOT NULL,
    "negocioId" TEXT NOT NULL,
    "autorId" TEXT NOT NULL,
    "texto" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notas_internas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "timeline_events" (
    "id" TEXT NOT NULL,
    "negocioId" TEXT NOT NULL,
    "tipo" "TipoTimelineEvent" NOT NULL,
    "payload" JSONB,
    "autorId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "timeline_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orcamentos" (
    "id" TEXT NOT NULL,
    "numero" SERIAL NOT NULL,
    "negocioId" TEXT NOT NULL,
    "versaoAtualId" TEXT,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "orcamentos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "versoes_orcamento" (
    "id" TEXT NOT NULL,
    "orcamentoId" TEXT NOT NULL,
    "numeroVersao" SERIAL NOT NULL,
    "responsavelId" TEXT,
    "clienteId" TEXT,
    "especificadorId" TEXT,
    "escritorioId" TEXT,
    "rt" DECIMAL(6,2) NOT NULL DEFAULT 0,
    "construtoraId" TEXT,
    "referenciaExterna" TEXT,
    "origem" TEXT,
    "status" "StatusVersaoOrcamento" NOT NULL DEFAULT 'RASCUNHO',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "versoes_orcamento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "itens_orcamento" (
    "id" TEXT NOT NULL,
    "versaoId" TEXT NOT NULL,
    "produtoId" TEXT,
    "descricao" TEXT,
    "nomeOriginal" TEXT,
    "fabricanteNome" TEXT,
    "quantidade" INTEGER NOT NULL DEFAULT 1,
    "precoUnitario" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "total" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "notaInterna" TEXT,
    "ordem" INTEGER NOT NULL DEFAULT 0,
    "removido" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "itens_orcamento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "produtos" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "fabricanteId" TEXT,
    "skuFabrica" TEXT,
    "ean" TEXT,
    "referenciaLoja" TEXT,
    "atributos" JSONB,
    "descricao" TEXT,
    "valorUnitario" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "unidade" TEXT NOT NULL DEFAULT 'unidades',
    "grupo" TEXT NOT NULL DEFAULT 'Serviços/Produtos',
    "medidaPersonalizada" TEXT,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "produtos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "imagens_produto" (
    "id" TEXT NOT NULL,
    "produtoId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "tipo" "TipoImagemProduto" NOT NULL,
    "ordem" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "imagens_produto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "formas_pagamento" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "config" JSONB,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "formas_pagamento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "banco_mensagens" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "texto" TEXT NOT NULL,
    "categoria" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "banco_mensagens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pedidos_compra" (
    "id" TEXT NOT NULL,
    "orcamentoId" TEXT NOT NULL,
    "numero" SERIAL NOT NULL,
    "status" "StatusPedidoCompra" NOT NULL DEFAULT 'PENDENTE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pedidos_compra_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cupons" (
    "id" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "tipo" "TipoCupom" NOT NULL,
    "valor" DECIMAL(14,2) NOT NULL,
    "validade" DATE,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cupons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_VersaoCompartilhadaCom" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_VersaoCompartilhadaCom_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_ProdutoCategorias" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ProdutoCategorias_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_NegocioEtiquetas" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_NegocioEtiquetas_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_VersaoEtiquetas" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_VersaoEtiquetas_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_NegocioCompartilhadoCom" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_NegocioCompartilhadoCom_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_AtividadeResponsaveis" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_AtividadeResponsaveis_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "etapas_funil_funilId_ordem_key" ON "etapas_funil"("funilId", "ordem");

-- CreateIndex
CREATE UNIQUE INDEX "negocios_numero_key" ON "negocios"("numero");

-- CreateIndex
CREATE UNIQUE INDEX "orcamentos_numero_key" ON "orcamentos"("numero");

-- CreateIndex
CREATE UNIQUE INDEX "orcamentos_negocioId_key" ON "orcamentos"("negocioId");

-- CreateIndex
CREATE UNIQUE INDEX "orcamentos_versaoAtualId_key" ON "orcamentos"("versaoAtualId");

-- CreateIndex
CREATE UNIQUE INDEX "versoes_orcamento_numeroVersao_key" ON "versoes_orcamento"("numeroVersao");

-- CreateIndex
CREATE UNIQUE INDEX "pedidos_compra_numero_key" ON "pedidos_compra"("numero");

-- CreateIndex
CREATE UNIQUE INDEX "cupons_codigo_key" ON "cupons"("codigo");

-- CreateIndex
CREATE INDEX "_VersaoCompartilhadaCom_B_index" ON "_VersaoCompartilhadaCom"("B");

-- CreateIndex
CREATE INDEX "_ProdutoCategorias_B_index" ON "_ProdutoCategorias"("B");

-- CreateIndex
CREATE INDEX "_NegocioEtiquetas_B_index" ON "_NegocioEtiquetas"("B");

-- CreateIndex
CREATE INDEX "_VersaoEtiquetas_B_index" ON "_VersaoEtiquetas"("B");

-- CreateIndex
CREATE INDEX "_NegocioCompartilhadoCom_B_index" ON "_NegocioCompartilhadoCom"("B");

-- CreateIndex
CREATE INDEX "_AtividadeResponsaveis_B_index" ON "_AtividadeResponsaveis"("B");

-- AddForeignKey
ALTER TABLE "especificadores" ADD CONSTRAINT "especificadores_escritorioId_fkey" FOREIGN KEY ("escritorioId") REFERENCES "escritorios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "etapas_funil" ADD CONSTRAINT "etapas_funil_funilId_fkey" FOREIGN KEY ("funilId") REFERENCES "funis"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "negocios" ADD CONSTRAINT "negocios_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "clientes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "negocios" ADD CONSTRAINT "negocios_responsavelId_fkey" FOREIGN KEY ("responsavelId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "negocios" ADD CONSTRAINT "negocios_especificadorId_fkey" FOREIGN KEY ("especificadorId") REFERENCES "especificadores"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "negocios" ADD CONSTRAINT "negocios_escritorioId_fkey" FOREIGN KEY ("escritorioId") REFERENCES "escritorios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "negocios" ADD CONSTRAINT "negocios_construtoraId_fkey" FOREIGN KEY ("construtoraId") REFERENCES "construtoras"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "negocios" ADD CONSTRAINT "negocios_funilId_fkey" FOREIGN KEY ("funilId") REFERENCES "funis"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "negocios" ADD CONSTRAINT "negocios_etapaId_fkey" FOREIGN KEY ("etapaId") REFERENCES "etapas_funil"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "negocios" ADD CONSTRAINT "negocios_motivoPerdaId_fkey" FOREIGN KEY ("motivoPerdaId") REFERENCES "motivos_perda"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "atividades" ADD CONSTRAINT "atividades_negocioId_fkey" FOREIGN KEY ("negocioId") REFERENCES "negocios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notas" ADD CONSTRAINT "notas_negocioId_fkey" FOREIGN KEY ("negocioId") REFERENCES "negocios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notas" ADD CONSTRAINT "notas_autorId_fkey" FOREIGN KEY ("autorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "anexos" ADD CONSTRAINT "anexos_negocioId_fkey" FOREIGN KEY ("negocioId") REFERENCES "negocios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notas_internas" ADD CONSTRAINT "notas_internas_negocioId_fkey" FOREIGN KEY ("negocioId") REFERENCES "negocios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notas_internas" ADD CONSTRAINT "notas_internas_autorId_fkey" FOREIGN KEY ("autorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "timeline_events" ADD CONSTRAINT "timeline_events_negocioId_fkey" FOREIGN KEY ("negocioId") REFERENCES "negocios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "timeline_events" ADD CONSTRAINT "timeline_events_autorId_fkey" FOREIGN KEY ("autorId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orcamentos" ADD CONSTRAINT "orcamentos_negocioId_fkey" FOREIGN KEY ("negocioId") REFERENCES "negocios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orcamentos" ADD CONSTRAINT "orcamentos_versaoAtualId_fkey" FOREIGN KEY ("versaoAtualId") REFERENCES "versoes_orcamento"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "versoes_orcamento" ADD CONSTRAINT "versoes_orcamento_orcamentoId_fkey" FOREIGN KEY ("orcamentoId") REFERENCES "orcamentos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "versoes_orcamento" ADD CONSTRAINT "versoes_orcamento_responsavelId_fkey" FOREIGN KEY ("responsavelId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "versoes_orcamento" ADD CONSTRAINT "versoes_orcamento_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "clientes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "versoes_orcamento" ADD CONSTRAINT "versoes_orcamento_especificadorId_fkey" FOREIGN KEY ("especificadorId") REFERENCES "especificadores"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "versoes_orcamento" ADD CONSTRAINT "versoes_orcamento_escritorioId_fkey" FOREIGN KEY ("escritorioId") REFERENCES "escritorios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "versoes_orcamento" ADD CONSTRAINT "versoes_orcamento_construtoraId_fkey" FOREIGN KEY ("construtoraId") REFERENCES "construtoras"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "itens_orcamento" ADD CONSTRAINT "itens_orcamento_versaoId_fkey" FOREIGN KEY ("versaoId") REFERENCES "versoes_orcamento"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "itens_orcamento" ADD CONSTRAINT "itens_orcamento_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES "produtos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "produtos" ADD CONSTRAINT "produtos_fabricanteId_fkey" FOREIGN KEY ("fabricanteId") REFERENCES "fabricantes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "imagens_produto" ADD CONSTRAINT "imagens_produto_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES "produtos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pedidos_compra" ADD CONSTRAINT "pedidos_compra_orcamentoId_fkey" FOREIGN KEY ("orcamentoId") REFERENCES "orcamentos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_VersaoCompartilhadaCom" ADD CONSTRAINT "_VersaoCompartilhadaCom_A_fkey" FOREIGN KEY ("A") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_VersaoCompartilhadaCom" ADD CONSTRAINT "_VersaoCompartilhadaCom_B_fkey" FOREIGN KEY ("B") REFERENCES "versoes_orcamento"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProdutoCategorias" ADD CONSTRAINT "_ProdutoCategorias_A_fkey" FOREIGN KEY ("A") REFERENCES "categorias_produto"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProdutoCategorias" ADD CONSTRAINT "_ProdutoCategorias_B_fkey" FOREIGN KEY ("B") REFERENCES "produtos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_NegocioEtiquetas" ADD CONSTRAINT "_NegocioEtiquetas_A_fkey" FOREIGN KEY ("A") REFERENCES "etiquetas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_NegocioEtiquetas" ADD CONSTRAINT "_NegocioEtiquetas_B_fkey" FOREIGN KEY ("B") REFERENCES "negocios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_VersaoEtiquetas" ADD CONSTRAINT "_VersaoEtiquetas_A_fkey" FOREIGN KEY ("A") REFERENCES "etiquetas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_VersaoEtiquetas" ADD CONSTRAINT "_VersaoEtiquetas_B_fkey" FOREIGN KEY ("B") REFERENCES "versoes_orcamento"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_NegocioCompartilhadoCom" ADD CONSTRAINT "_NegocioCompartilhadoCom_A_fkey" FOREIGN KEY ("A") REFERENCES "negocios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_NegocioCompartilhadoCom" ADD CONSTRAINT "_NegocioCompartilhadoCom_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AtividadeResponsaveis" ADD CONSTRAINT "_AtividadeResponsaveis_A_fkey" FOREIGN KEY ("A") REFERENCES "atividades"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AtividadeResponsaveis" ADD CONSTRAINT "_AtividadeResponsaveis_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
