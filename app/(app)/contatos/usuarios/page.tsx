import { getPrisma } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { EntityManager, type EntityField, type EntityColumn } from "@/components/contatos/entity-manager";
import { papelUsuarioLabels } from "@/lib/labels/pt-BR";
import { criarUsuario, atualizarUsuario, excluirUsuario } from "./actions";

const fields: EntityField[] = [
  { name: "nome", label: "Nome", type: "text" },
  { name: "email", label: "E-mail", type: "email" },
  {
    name: "papel",
    label: "Papel",
    type: "select",
    placeholder: "Selecione o papel",
    options: [
      { value: "VENDEDOR", label: "Vendedor" },
      { value: "ASSISTENTE", label: "Assistente" },
      { value: "ADMIN", label: "Admin" },
    ],
  },
  {
    name: "ativo",
    label: "Status",
    type: "select",
    placeholder: "Selecione o status",
    options: [
      { value: "true", label: "Ativo" },
      { value: "false", label: "Inativo" },
    ],
  },
  {
    name: "senha",
    label: "Senha",
    type: "password",
    helpText: "Ao editar, deixe em branco para manter a senha atual.",
  },
];

const columns: EntityColumn[] = [
  { key: "nome", label: "Nome" },
  { key: "email", label: "E-mail" },
  { key: "papel", label: "Papel" },
  { key: "ativo", label: "Status" },
];

export default async function UsuariosPage() {
  const prisma = await getPrisma();
  const usuarios = await prisma.user.findMany({
    orderBy: { nome: "asc" },
    select: { id: true, nome: true, email: true, papel: true, ativo: true },
  });

  const items = usuarios.map((u) => ({
    id: u.id,
    formValues: {
      nome: u.nome,
      email: u.email,
      papel: u.papel,
      ativo: String(u.ativo),
      senha: "",
    },
    cells: {
      nome: u.nome,
      email: u.email,
      papel: papelUsuarioLabels[u.papel] ?? u.papel,
      ativo: (
        <Badge variant={u.ativo ? "success" : "secondary"}>
          {u.ativo ? "Ativo" : "Inativo"}
        </Badge>
      ),
    },
  }));

  return (
    <EntityManager
      title="Usuários / Vendedores"
      novoLabel="Novo usuário"
      fields={fields}
      columns={columns}
      items={items}
      onCreate={criarUsuario}
      onUpdate={atualizarUsuario}
      onDelete={excluirUsuario}
    />
  );
}
