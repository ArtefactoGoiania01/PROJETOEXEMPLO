import { prisma } from "@/lib/db";
import { EntityManager, type EntityField, type EntityColumn } from "@/components/contatos/entity-manager";
import {
  criarEspecificador,
  atualizarEspecificador,
  excluirEspecificador,
} from "./actions";

export default async function EspecificadoresPage() {
  const [especificadores, escritorios] = await Promise.all([
    prisma.especificador.findMany({
      orderBy: { nome: "asc" },
      include: { escritorio: { select: { razaoSocial: true } } },
    }),
    prisma.escritorio.findMany({
      orderBy: { razaoSocial: "asc" },
      select: { id: true, razaoSocial: true },
    }),
  ]);

  const items = especificadores.map((e) => ({
    id: e.id,
    formValues: {
      nome: e.nome,
      whatsapp: e.whatsapp ?? "",
      email: e.email ?? "",
      escritorioId: e.escritorioId ?? "",
    },
    cells: {
      nome: e.nome,
      whatsapp: e.whatsapp ?? "—",
      escritorio: e.escritorio?.razaoSocial ?? "—",
    },
  }));

  const fields: EntityField[] = [
    { name: "nome", label: "Nome", type: "text" },
    { name: "whatsapp", label: "WhatsApp", type: "tel" },
    { name: "email", label: "E-mail", type: "email" },
    {
      name: "escritorioId",
      label: "Escritório",
      type: "select",
      placeholder: "Selecione um escritório",
      options: escritorios.map((e) => ({ value: e.id, label: e.razaoSocial })),
    },
  ];

  const columns: EntityColumn[] = [
    { key: "nome", label: "Nome" },
    { key: "whatsapp", label: "WhatsApp" },
    { key: "escritorio", label: "Escritório" },
  ];

  return (
    <EntityManager
      title="Especificadores"
      novoLabel="Novo especificador"
      fields={fields}
      columns={columns}
      items={items}
      onCreate={criarEspecificador}
      onUpdate={atualizarEspecificador}
      onDelete={excluirEspecificador}
    />
  );
}
