import { getPrisma } from "@/lib/db";
import { EntityManager, type EntityField, type EntityColumn } from "@/components/contatos/entity-manager";
import { criarCategoria, atualizarCategoria, excluirCategoria } from "./actions";

const fields: EntityField[] = [{ name: "nome", label: "Nome", type: "text" }];

const columns: EntityColumn[] = [{ key: "nome", label: "Nome" }];

export default async function CategoriasPage() {
  const prisma = await getPrisma();
  const categorias = await prisma.categoriaProduto.findMany({
    orderBy: { nome: "asc" },
    select: { id: true, nome: true },
  });

  const items = categorias.map((c) => ({
    id: c.id,
    formValues: { nome: c.nome },
    cells: { nome: c.nome },
  }));

  return (
    <EntityManager
      title="Categorias de produto"
      novoLabel="Nova categoria"
      fields={fields}
      columns={columns}
      items={items}
      onCreate={criarCategoria}
      onUpdate={atualizarCategoria}
      onDelete={excluirCategoria}
    />
  );
}
