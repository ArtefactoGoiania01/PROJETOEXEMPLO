// Dados em memória — este app é um exemplo/teste e não usa banco de dados.
// Tudo aqui vive só na instância do processo: reinicia ao reiniciar o
// servidor (dev/Docker) e não persiste entre requisições em serverless
// (Cloudflare Workers). É intencional, dado o escopo de "só visual".

export type Endereco = {
  logradouro?: string;
  cidade?: string;
  estado?: string;
  cep?: string;
};

export type Cliente = {
  id: string;
  nome: string;
  telefone: string | null;
  whatsapp: string | null;
  email: string | null;
  documento: string | null;
  endereco: Endereco | null;
  obs: string | null;
  deletedAt: Date | null;
};

export type Escritorio = {
  id: string;
  razaoSocial: string;
  nomeFantasia: string | null;
  documento: string | null;
  contato: string | null;
};

export type Especificador = {
  id: string;
  nome: string;
  whatsapp: string | null;
  email: string | null;
  escritorioId: string | null;
};

export type Construtora = { id: string; nome: string };
export type Fabricante = { id: string; nome: string };
export type CategoriaProduto = { id: string; nome: string };

export type Usuario = {
  id: string;
  nome: string;
  email: string;
  papel: "VENDEDOR" | "ASSISTENTE" | "ADMIN";
  ativo: boolean;
  senhaHash: string;
};

export type EtapaFunil = { id: string; nome: string; ordem: number; cor: string };
export type MotivoPerda = { id: string; nome: string; ativo: boolean };

export type Negocio = {
  id: string;
  numero: number;
  titulo: string;
  clienteId: string;
  responsavelId: string;
  especificadorId: string | null;
  escritorioId: string | null;
  etapaId: string;
  valor: string;
  codReferencia: string | null;
  dataEntrega: Date | null;
  previsaoFechamento: Date | null;
  potencialVendas: "ALTO" | "MEDIO" | "BAIXO" | null;
  status: "ABERTO" | "VENDIDO" | "CANCELADO";
  motivoPerdaId: string | null;
  inicio: Date;
  temAtividade: boolean;
};

function id(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

export const usuarios: Usuario[] = [
  {
    id: "user-admin",
    nome: "Administrador",
    email: "admin@artefactogoiania.com",
    papel: "ADMIN",
    ativo: true,
    senhaHash: "",
  },
  {
    id: "user-eunice",
    nome: "EUNICE MARTINS",
    email: "eunice.martins@artefactogoiania.com",
    papel: "VENDEDOR",
    ativo: true,
    senhaHash: "",
  },
  {
    id: "user-natanael",
    nome: "NATANAEL SANTOS",
    email: "natanael.santos@artefactogoiania.com",
    papel: "ASSISTENTE",
    ativo: true,
    senhaHash: "",
  },
];

export const escritorios: Escritorio[] = [
  {
    id: "escritorio-1",
    razaoSocial: "Studio Arquitetura & Design Ltda",
    nomeFantasia: "Studio A&D",
    documento: "12.345.678/0001-90",
    contato: "(62) 3222-1100",
  },
];

export const especificadores: Especificador[] = [
  {
    id: "especificador-1",
    nome: "Arq. Camila Rezende",
    whatsapp: "5562988887777",
    email: "camila@studioaed.com",
    escritorioId: "escritorio-1",
  },
];

export const construtoras: Construtora[] = [
  { id: "construtora-1", nome: "Construtora Alfa Empreendimentos" },
];

export const fabricantes: Fabricante[] = [{ id: "fabricante-1", nome: "Artefacto" }];

export const categorias: CategoriaProduto[] = [{ id: "categoria-1", nome: "Móveis" }];

export const motivosPerda: MotivoPerda[] = [
  { id: "motivo-preco", nome: "Preço", ativo: true },
  { id: "motivo-concorrencia", nome: "Concorrência", ativo: true },
  { id: "motivo-prazo", nome: "Prazo de entrega", ativo: true },
  { id: "motivo-desistiu", nome: "Desistiu da compra", ativo: true },
];

export type Produto = {
  id: string;
  nome: string;
  categoriaId: string | null;
  fabricanteId: string | null;
  valorUnitario: string;
  unidade: string;
  descricao: string | null;
};

export type ItemOrcamento = {
  id: string;
  produtoId: string | null;
  descricao: string;
  quantidade: number;
  precoUnitario: string;
};

export type Orcamento = {
  negocioId: string;
  numero: number;
  rt: string;
  itens: ItemOrcamento[];
};

export const etapasFunil: EtapaFunil[] = [
  { id: "etapa-1", nome: "INÍCIO DE DESENVOLVIMENTO (VENDEDOR)", ordem: 0, cor: "#94a3b8" },
  {
    id: "etapa-2",
    nome: "LAYOUT/W-GET SENDO TRABALHADO (VENDEDOR E ASSISTENTE)",
    ordem: 1,
    cor: "#60a5fa",
  },
  {
    id: "etapa-3",
    nome: "ORÇAMENTO HOPE ASSISTENTES (VENDEDOR E ASSISTENTE)",
    ordem: 2,
    cor: "#818cf8",
  },
  {
    id: "etapa-4",
    nome: "DEMONSTRAÇÃO (VENDEDOR E ASSISTENTE-IMPORTAR CETROS)",
    ordem: 3,
    cor: "#c084fc",
  },
  { id: "etapa-5", nome: "ORÇAMENTO FINALIZADO (VENDEDOR)", ordem: 4, cor: "#f472b6" },
  { id: "etapa-6", nome: "EM NEGOCIAÇÃO (VENDEDOR)", ordem: 5, cor: "#fb923c" },
  { id: "etapa-7", nome: "REPESCAGEM (VENDEDOR)", ordem: 6, cor: "#facc15" },
];

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

export const clientes: Cliente[] = nomesClientes.map((nome, i) => ({
  id: `cliente-${i}`,
  nome,
  telefone: "(62) 99999-0000",
  whatsapp: "5562999990000",
  email: `${nome.toLowerCase().replace(/\s+/g, ".")}@email.com`,
  documento: "000.000.000-00",
  endereco: null,
  obs: null,
  deletedAt: null,
}));

const responsaveis = ["user-eunice", "user-natanael", "user-admin"];

export const negocios: Negocio[] = clientes.map((cliente, i) => ({
  id: `negocio-${i}`,
  numero: 10900 + i,
  titulo: `Projeto ${cliente.nome}`,
  clienteId: cliente.id,
  responsavelId: responsaveis[i % responsaveis.length],
  especificadorId: i % 3 === 0 ? "especificador-1" : null,
  escritorioId: i % 3 === 0 ? "escritorio-1" : null,
  etapaId: etapasFunil[i % etapasFunil.length].id,
  valor: (15000 + i * 4231.5).toFixed(2),
  codReferencia: i % 2 === 0 ? `REF-${1000 + i}` : null,
  dataEntrega: null,
  previsaoFechamento: null,
  potencialVendas: null,
  status: "ABERTO",
  motivoPerdaId: null,
  inicio: new Date(),
  temAtividade: false,
}));

export const produtos: Produto[] = [
  {
    id: "produto-1",
    nome: "Sofá Modular Nuvem",
    categoriaId: "categoria-1",
    fabricanteId: "fabricante-1",
    valorUnitario: "8990.00",
    unidade: "unidades",
    descricao: "Sofá modular 3 lugares, tecido linho",
  },
  {
    id: "produto-2",
    nome: "Mesa de Jantar Carvalho",
    categoriaId: "categoria-1",
    fabricanteId: "fabricante-1",
    valorUnitario: "6500.00",
    unidade: "unidades",
    descricao: "Mesa 220x100cm em madeira maciça",
  },
  {
    id: "produto-3",
    nome: "Poltrona Aconchego",
    categoriaId: "categoria-1",
    fabricanteId: "fabricante-1",
    valorUnitario: "2450.00",
    unidade: "unidades",
    descricao: null,
  },
];

export const orcamentos: Orcamento[] = negocios.map((n, i) => ({
  negocioId: n.id,
  numero: 19820000 + i,
  rt: "12.74",
  itens: [],
}));

export function novoId(prefix: string) {
  return id(prefix);
}
