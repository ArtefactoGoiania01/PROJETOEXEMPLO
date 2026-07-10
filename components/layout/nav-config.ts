import type { LucideIcon } from "lucide-react";
import {
  Handshake,
  Users,
  FolderOpen,
  CalendarDays,
  BarChart3,
  UserPlus,
  Sofa,
  Download,
} from "lucide-react";

export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

export const sidebarNav: NavItem[] = [
  { href: "/negocios", label: "Negócios", icon: Handshake },
  { href: "/contatos", label: "Contatos", icon: Users },
  { href: "/arquivos", label: "Arquivos", icon: FolderOpen },
  { href: "/agenda", label: "Agenda", icon: CalendarDays },
  { href: "/relatorios", label: "Relatórios", icon: BarChart3 },
  { href: "/captacao", label: "Captação de Clientes", icon: UserPlus },
  { href: "/produtos", label: "Produtos", icon: Sofa },
  { href: "/exportacao", label: "Exportação de dados", icon: Download },
];

export const negociosSubmenu = [
  { href: "/negocios", label: "Funil" },
  { href: "/negocios/lista", label: "Negócios em lista" },
  { href: "/negocios/sem-acompanhamento", label: "Sem acompanhamento" },
  { href: "/negocios/motivos-perda", label: "Motivos de perda" },
  { href: "/negocios/vendedores", label: "Vendedores" },
  { href: "/negocios/margem-lucro", label: "Margem de lucro dos negócios" },
  { href: "/negocios/cupons", label: "Cupons" },
  { href: "/negocios/pedidos-compra", label: "Pedidos de compra" },
  { href: "/negocios/lixeira", label: "Lixeira" },
  { href: "/negocios/banco-mensagens", label: "Banco de mensagens" },
  { href: "/negocios/formas-pagamento", label: "Formas de pagamento" },
];

export const contatosSubmenu = [
  { href: "/contatos/clientes", label: "Clientes" },
  { href: "/contatos/especificadores", label: "Especificadores" },
  { href: "/contatos/escritorios", label: "Escritórios" },
  { href: "/contatos/construtoras", label: "Construtoras" },
  { href: "/contatos/fabricantes", label: "Fabricantes" },
  { href: "/contatos/categorias", label: "Categorias de produto" },
  { href: "/contatos/usuarios", label: "Usuários / Vendedores" },
];
