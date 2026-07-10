import { getPrisma } from "@/lib/db";
import { EntityManager, type EntityField, type EntityColumn } from "@/components/contatos/entity-manager";
import {
  criarFabricante,
  atualizarFabricante,
  excluirFabricante,
} from "./actions";

const fields: EntityField[] = [{ name: "nome", label: "Nome", type: "text" }];

const columns: EntityColumn[] = [{ key: "nome", label: "Nome" }];

export default async function FabricantesPage() {
  const prisma = await getPrisma();
  const fabricantes = await prisma.fabricante.findMany({
    orderBy: { nome: "asc" },
    select: { id: true, nome: true },
  });

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
