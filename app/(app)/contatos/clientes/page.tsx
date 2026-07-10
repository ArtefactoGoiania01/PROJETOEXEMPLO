import { clientes } from "@/lib/mock-data";
import { EntityManager, type EntityField, type EntityColumn } from "@/components/contatos/entity-manager";
import { criarCliente, atualizarCliente, excluirCliente } from "./actions";

const fields: EntityField[] = [
  { name: "nome", label: "Nome", type: "text" },
  { name: "telefone", label: "Telefone", type: "tel" },
  { name: "whatsapp", label: "WhatsApp", type: "tel" },
  { name: "email", label: "E-mail", type: "email" },
  { name: "documento", label: "CPF/CNPJ", type: "text" },
  { name: "logradouro", label: "Endereço", type: "text" },
  { name: "cidade", label: "Cidade", type: "text" },
  { name: "estado", label: "Estado (UF)", type: "text" },
  { name: "cep", label: "CEP", type: "text" },
  { name: "obs", label: "Observações", type: "textarea" },
];

const columns: EntityColumn[] = [
  { key: "nome", label: "Nome" },
  { key: "telefone", label: "Telefone" },
  { key: "email", label: "E-mail" },
  { key: "documento", label: "CPF/CNPJ" },
];

export default function ClientesPage() {
  const items = clientes
    .filter((c) => !c.deletedAt)
    .map((c) => ({
      id: c.id,
      formValues: {
        nome: c.nome,
        telefone: c.telefone ?? "",
        whatsapp: c.whatsapp ?? "",
        email: c.email ?? "",
        documento: c.documento ?? "",
        logradouro: c.endereco?.logradouro ?? "",
        cidade: c.endereco?.cidade ?? "",
        estado: c.endereco?.estado ?? "",
        cep: c.endereco?.cep ?? "",
        obs: c.obs ?? "",
      },
      cells: {
        nome: c.nome,
        telefone: c.telefone ?? "—",
        email: c.email ?? "—",
        documento: c.documento ?? "—",
      },
    }));

  return (
    <EntityManager
      title="Clientes"
      novoLabel="Novo cliente"
      fields={fields}
      columns={columns}
      items={items}
      onCreate={criarCliente}
      onUpdate={atualizarCliente}
      onDelete={excluirCliente}
    />
  );
}
