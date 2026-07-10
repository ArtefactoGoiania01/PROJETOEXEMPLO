import { fabricantes } from "@/lib/mock-data";
import { EntityManager, type EntityField, type EntityColumn } from "@/components/contatos/entity-manager";
import {
  criarFabricante,
  atualizarFabricante,
  excluirFabricante,
} from "./actions";

const fields: EntityField[] = [{ name: "nome", label: "Nome", type: "text" }];

const columns: EntityColumn[] = [{ key: "nome", label: "Nome" }];

export default function FabricantesPage() {
  const items = fabricantes.map((f) => ({
    id: f.id,
    formValues: { nome: f.nome },
    cells: { nome: f.nome },
  }));

  return (
    <EntityManager
      title="Fabricantes"
      novoLabel="Novo fabricante"
      fields={fields}
      columns={columns}
      items={items}
      onCreate={criarFabricante}
      onUpdate={atualizarFabricante}
      onDelete={excluirFabricante}
    />
  );
}
