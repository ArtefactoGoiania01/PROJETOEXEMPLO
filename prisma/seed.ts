import { PrismaClient, PapelUsuario, StatusNegocio } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const ETAPAS_VENDAS = [
  { nome: "INÍCIO DE DESENVOLVIMENTO (VENDEDOR)", cor: "#94a3b8" },
  { nome: "LAYOUT/W-GET SENDO TRABALHADO (VENDEDOR E ASSISTENTE)", cor: "#60a5fa" },
  { nome: "ORÇAMENTO HOPE ASSISTENTES (VENDEDOR E ASSISTENTE)", cor: "#818cf8" },
  { nome: "DEMONSTRAÇÃO (VENDEDOR E ASSISTENTE-IMPORTAR CETROS)", cor: "#c084fc" },
  { nome: "ORÇAMENTO FINALIZADO (VENDEDOR)", cor: "#f472b6" },
  { nome: "EM NEGOCIAÇÃO (VENDEDOR)", cor: "#fb923c" },
  { nome: "REPESCAGEM (VENDEDOR)", cor: "#facc15" },
];

async function main() {
  const senhaHash = await bcrypt.hash("123456", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@artefactogoiania.com" },
    update: {},
    create: {
      nome: "Administrador",
      email: "admin@artefactogoiania.com",
      senhaHash,
      papel: PapelUsuario.ADMIN,
    },
  });

  const eunice = await prisma.user.upsert({
    where: { email: "eunice.martins@artefactogoiania.com" },
    update: {},
    create: {
      nome: "EUNICE MARTINS",
      email: "eunice.martins@artefactogoiania.com",
      senhaHash,
      papel: PapelUsuario.VENDEDOR,
    },
  });

  const natanael = await prisma.user.upsert({
    where: { email: "natanael.santos@artefactogoiania.com" },
    update: {},
    create: {
      nome: "NATANAEL SANTOS",
      email: "natanael.santos@artefactogoiania.com",
      senhaHash,
      papel: PapelUsuario.ASSISTENTE,
    },
  });

  let funil = await prisma.funil.findFirst({ where: { nome: "VENDAS" } });
  if (!funil) {
    funil = await prisma.funil.create({ data: { nome: "VENDAS" } });
  }

  const etapas = [];
  for (let i = 0; i < ETAPAS_VENDAS.length; i++) {
    const etapaData = ETAPAS_VENDAS[i];
    const etapa = await prisma.etapaFunil.upsert({
      where: { funilId_ordem: { funilId: funil.id, ordem: i } },
      update: { nome: etapaData.nome, cor: etapaData.cor },
      create: {
        funilId: funil.id,
        nome: etapaData.nome,
        ordem: i,
        cor: etapaData.cor,
      },
    });
    etapas.push(etapa);
  }

  const motivosPerda = await Promise.all(
    ["Preço", "Concorrência", "Prazo de entrega", "Desistiu da compra"].map(
      (nome) =>
        prisma.motivoPerda.upsert({
          where: { id: `seed-motivo-${nome}` },
          update: {},
          create: { id: `seed-motivo-${nome}`, nome },
        }),
    ),
  );

  const escritorio = await prisma.escritorio.upsert({
    where: { id: "seed-escritorio-1" },
    update: {},
    create: {
      id: "seed-escritorio-1",
      razaoSocial: "Studio Arquitetura & Design Ltda",
      nomeFantasia: "Studio A&D",
      documento: "12.345.678/0001-90",
      contato: "(62) 3222-1100",
    },
  });

  const especificador = await prisma.especificador.upsert({
    where: { id: "seed-especificador-1" },
    update: {},
    create: {
      id: "seed-especificador-1",
      nome: "Arq. Camila Rezende",
      whatsapp: "5562988887777",
      email: "camila@studioaed.com",
      escritorioId: escritorio.id,
    },
  });

  const construtora = await prisma.construtora.upsert({
    where: { id: "seed-construtora-1" },
    update: {},
    create: { id: "seed-construtora-1", nome: "Construtora Alfa Empreendimentos" },
  });

  const fabricante = await prisma.fabricante.upsert({
    where: { id: "seed-fabricante-1" },
    update: {},
    create: { id: "seed-fabricante-1", nome: "Artefacto" },
  });

  const categoria = await prisma.categoriaProduto.upsert({
    where: { id: "seed-categoria-1" },
    update: {},
    create: { id: "seed-categoria-1", nome: "Móveis" },
  });

  const nomesClientes = [
    "Ricardo Almeida",
    "Fernanda Souza",
    "Marcelo Tavares",
    "Juliana Prado",
    "Roberto Lima",
    "Patrícia Nogueira",
    "André Bittencourt",
    "Camila Ferraz",
    "Gustavo Rocha",
    "Beatriz Cardoso",
  ];

  const clientes = [];
  for (const nome of nomesClientes) {
    const cliente = await prisma.cliente.upsert({
      where: { id: `seed-cliente-${nome}` },
      update: {},
      create: {
        id: `seed-cliente-${nome}`,
        nome,
        telefone: "(62) 99999-0000",
        whatsapp: "5562999990000",
        email: `${nome.toLowerCase().replace(/\s+/g, ".")}@email.com`,
        documento: "000.000.000-00",
      },
    });
    clientes.push(cliente);
  }

  const responsaveis = [eunice, natanael, admin];

  for (let i = 0; i < clientes.length; i++) {
    const cliente = clientes[i];
    const etapa = etapas[i % etapas.length];
    const responsavel = responsaveis[i % responsaveis.length];
    const valor = 15000 + i * 4231.5;

    const numero = 10900 + i;
    const existente = await prisma.negocio.findUnique({ where: { numero } });
    if (existente) continue;

    await prisma.negocio.create({
      data: {
        numero,
        titulo: `Projeto ${cliente.nome}`,
        clienteId: cliente.id,
        responsavelId: responsavel.id,
        especificadorId: i % 3 === 0 ? especificador.id : null,
        escritorioId: i % 3 === 0 ? escritorio.id : null,
        construtoraId: i % 4 === 0 ? construtora.id : null,
        funilId: funil.id,
        etapaId: etapa.id,
        valor,
        codReferencia: i % 2 === 0 ? `REF-${1000 + i}` : null,
        status: StatusNegocio.ABERTO,
        timelineEvents: {
          create: {
            tipo: "LOG",
            payload: { mensagem: "Negócio criado via seed" },
            autorId: responsavel.id,
          },
        },
      },
    });
  }

  await Promise.all(
    [
      { nome: "Cartão", config: { parcelas: 12 } },
      { nome: "Boleto", config: { parcelas: 1 } },
      { nome: "PIX", config: { parcelas: 1 } },
    ].map((f) =>
      prisma.formaPagamento.upsert({
        where: { id: `seed-forma-${f.nome}` },
        update: {},
        create: { id: `seed-forma-${f.nome}`, nome: f.nome, config: f.config },
      }),
    ),
  );

  await prisma.bancoMensagem.upsert({
    where: { id: "seed-mensagem-1" },
    update: {},
    create: {
      id: "seed-mensagem-1",
      titulo: "Boas-vindas",
      texto: "Olá! Obrigado pelo seu interesse em nossos móveis. Como posso ajudar?",
      categoria: "Geral",
    },
  });

  console.log("Seed concluído.");
  console.log({ fabricante: fabricante.nome, categoria: categoria.nome, motivosPerda: motivosPerda.length });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
