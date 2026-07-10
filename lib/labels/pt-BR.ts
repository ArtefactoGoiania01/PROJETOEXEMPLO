// Central de labels em Português (Brasil) do domínio do CRM.
// Mantenha toda string de UI referente ao domínio aqui para facilitar manutenção.

export const papelUsuarioLabels: Record<string, string> = {
  VENDEDOR: "Vendedor",
  ASSISTENTE: "Assistente",
  ADMIN: "Admin",
};

export const potencialVendasLabels: Record<string, string> = {
  ALTO: "Alto",
  MEDIO: "Médio",
  BAIXO: "Baixo",
};

export const statusNegocioLabels: Record<string, string> = {
  ABERTO: "Aberto",
  VENDIDO: "Vendido",
  CANCELADO: "Cancelado",
};

export const statusAtividadeLabels: Record<string, string> = {
  SEM_ATIVIDADES: "Sem atividades",
  PLANEJADA: "Planejada",
  ATRASADA: "Atrasada",
  CONCLUIDA: "Concluída",
};

export const tipoTimelineEventLabels: Record<string, string> = {
  ATIVIDADE: "Atividades",
  NOTA: "Notas",
  IMAGEM: "Imagens",
  ARQUIVO: "Arquivos",
  WHATSAPP: "WhatsApp",
  LOG: "Log",
  NOTA_INTERNA: "Notas Internas",
};

export const tipoImagemProdutoLabels: Record<string, string> = {
  TECNICA: "Técnica",
  AMBIENTE: "Ambientação",
};

export const statusVersaoOrcamentoLabels: Record<string, string> = {
  RASCUNHO: "Rascunho",
  ENVIADO: "Enviado",
  APROVADO: "Aprovado",
  REJEITADO: "Rejeitado",
};

export const statusPedidoCompraLabels: Record<string, string> = {
  PENDENTE: "Pendente",
  CONFIRMADO: "Confirmado",
  CANCELADO: "Cancelado",
};

export const tipoCupomLabels: Record<string, string> = {
  PERCENTUAL: "Percentual",
  VALOR_FIXO: "Valor fixo",
};

export const navLabels = {
  negocios: "Negócios",
  contatos: "Contatos",
  arquivos: "Arquivos",
  agenda: "Agenda",
  relatorios: "Relatórios",
  captacao: "Captação de Clientes",
  produtos: "Produtos",
  exportacao: "Exportação de dados",
};

export const negociosSubmenuLabels = {
  funil: "Funil",
  listaNegocios: "Negócios em lista",
  semAcompanhamento: "Sem acompanhamento",
  motivosPerda: "Motivos de perda",
  vendedores: "Vendedores",
  margemLucro: "Margem de lucro dos negócios",
  cupons: "Cupons",
  pedidosCompra: "Pedidos de compra",
  lixeira: "Lixeira",
  bancoMensagens: "Banco de mensagens",
  formasPagamento: "Formas de pagamento",
};

export const contatosSubmenuLabels = {
  clientes: "Clientes",
  especificadores: "Especificadores",
  escritorios: "Escritórios",
  construtoras: "Construtoras",
  fabricantes: "Fabricantes",
  categorias: "Categorias de produto",
  usuarios: "Usuários / Vendedores",
};

export const commonLabels = {
  salvar: "Salvar",
  cancelar: "Cancelar",
  editar: "Editar",
  excluir: "Excluir",
  novo: "Novo",
  nome: "Nome",
  email: "E-mail",
  telefone: "Telefone",
  whatsapp: "WhatsApp",
  documento: "CPF/CNPJ",
  acoes: "Ações",
  buscar: "Buscar",
  semResultados: "Nenhum resultado encontrado.",
  confirmarExclusao: "Tem certeza que deseja excluir?",
  confirmarExclusaoDescricao: "Esta ação não pode ser desfeita.",
};

export const formatarMoeda = (valor: number | string) => {
  const numero = typeof valor === "string" ? Number(valor) : valor;
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(numero);
};

export const formatarData = (data: Date | string | null | undefined) => {
  if (!data) return "";
  const d = typeof data === "string" ? new Date(data) : data;
  return new Intl.DateTimeFormat("pt-BR").format(d);
};
