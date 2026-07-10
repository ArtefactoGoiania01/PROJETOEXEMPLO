import { construtoras } from "@/lib/mock-data";
import { EntityManager, type EntityField, type EntityColumn } from "@/components/contatos/entity-manager";
import {
  criarConstrutora,
  atualizarConstrutora,
  excluirConstrutora,
} from "./actions";

const fields: EntityField[] = [{ name: "nome", label: "Nome", type: "text" }];

const columns: EntityColumn[] = [{ key: "nome", label: "Nome" }];

export default function ConstrutorasPage() {
  const items = construtoras.map((c) => ({
    id: c.id,
    formValues: { nome: c.nome },
    cells: { nome: c.nome },
  }));

  return (
    <EntityManager
      title="Construtoras"
      novoLabel="Nova construtora"
      fields={fields}
      columns={columns}
      items={items}
      onCreate={criarConstrutora}
      onUpdate={atualizarConstrutora}
      onDelete={excluirConstrutora}
    />
  );
}
