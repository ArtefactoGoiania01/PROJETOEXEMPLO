import { getPrisma } from "@/lib/db";
import { EntityManager, type EntityField, type EntityColumn } from "@/components/contatos/entity-manager";
import {
  criarEscritorio,
  atualizarEscritorio,
  excluirEscritorio,
} from "./actions";

const fields: EntityField[] = [
  { name: "razaoSocial", label: "Razão social", type: "text" },
  { name: "nomeFantasia", label: "Nome fantasia", type: "text" },
  { name: "documento", label: "CPF/CNPJ", type: "text" },
  { name: "contato", label: "Contato", type: "text" },
];

const columns: EntityColumn[] = [
  { key: "razaoSocial", label: "Razão social" },
  { key: "nomeFantasia", label: "Nome fantasia" },
  { key: "contato", label: "Contato" },
];

export default async function EscritoriosPage() {
  const prisma = await getPrisma();
  const escritorios = await prisma.escritorio.findMany({
    orderBy: { razaoSocial: "asc" },
  });

  const items = escritorios.map((e) => ({
    id: e.id,
    formValues: {
      razaoSocial: e.razaoSocial,
      nomeFantasia: e.nomeFantasia ?? "",
      documento: e.documento ?? "",
      contato: e.contato ?? "",
    },
    cells: {
      razaoSocial: e.razaoSocial,
      nomeFantasia: e.nomeFantasia ?? "—",
      contato: e.contato ?? "—",
    },
  }));

  return (
    <EntityManager
      title="Escritórios"
      novoLabel="Novo escritório"
      fields={fields}
      columns={columns}
      items={items}
      onCreate={criarEscritorio}
      onUpdate={atualizarEscritorio}
      onDelete={excluirEscritorio}
    />
  );
}
