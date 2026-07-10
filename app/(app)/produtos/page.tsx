import { produtos, categorias, fabricantes } from "@/lib/mock-data";
import { EntityManager, type EntityField, type EntityColumn } from "@/components/contatos/entity-manager";
import { formatarMoeda } from "@/lib/labels/pt-BR";
import { criarProduto, atualizarProduto, excluirProduto } from "./actions";

export default function ProdutosPage() {
  const items = produtos.map((p) => {
    const categoria = categorias.find((c) => c.id === p.categoriaId);
    const fabricante = fabricantes.find((f) => f.id === p.fabricanteId);
    return {
      id: p.id,
      formValues: {
        nome: p.nome,
        categoriaId: p.categoriaId ?? "",
        fabricanteId: p.fabricanteId ?? "",
        valorUnitario: p.valorUnitario,
        unidade: p.unidade,
        descricao: p.descricao ?? "",
      },
      cells: {
        nome: p.nome,
        categoria: categoria?.nome ?? "—",
        fabricante: fabricante?.nome ?? "—",
        valorUnitario: formatarMoeda(p.valorUnitario),
      },
    };
  });

  const fields: EntityField[] = [
    { name: "nome", label: "Nome do produto", type: "text" },
    {
      name: "categoriaId",
      label: "Categoria",
      type: "select",
      placeholder: "Selecione uma categoria",
      options: categorias.map((c) => ({ value: c.id, label: c.nome })),
    },
    {
      name: "fabricanteId",
      label: "Fabricante",
      type: "select",
      placeholder: "Selecione um fabricante",
      options: fabricantes.map((f) => ({ value: f.id, label: f.nome })),
    },
    { name: "valorUnitario", label: "Valor unitário (R$)", type: "text" },
    { name: "unidade", label: "Unidade", type: "text", placeholder: "unidades" },
    { name: "descricao", label: "Descrição", type: "textarea" },
  ];

  const columns: EntityColumn[] = [
    { key: "nome", label: "Produto" },
    { key: "categoria", label: "Categoria" },
    { key: "fabricante", label: "Fabricante" },
    { key: "valorUnitario", label: "Valor unitário" },
  ];

  return (
    <EntityManager
      title="Produtos"
      novoLabel="Novo produto"
      fields={fields}
      columns={columns}
      items={items}
      onCreate={criarProduto}
      onUpdate={atualizarProduto}
      onDelete={excluirProduto}
    />
  );
}
