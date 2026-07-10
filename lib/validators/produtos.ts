import { z } from "zod";

const optionalString = z
  .string()
  .trim()
  .optional()
  .transform((v) => (v === "" ? undefined : v));

export const produtoSchema = z.object({
  nome: z.string().trim().min(1, "Informe o nome."),
  categoriaId: optionalString,
  fabricanteId: optionalString,
  valorUnitario: z
    .string()
    .trim()
    .min(1, "Informe o valor unitário.")
    .refine((v) => !Number.isNaN(Number(v.replace(",", "."))), "Valor inválido."),
  unidade: z.string().trim().min(1, "Informe a unidade."),
  descricao: optionalString,
});
export type ProdutoInput = z.infer<typeof produtoSchema>;

export const itemOrcamentoSchema = z.object({
  produtoId: optionalString,
  descricao: z.string().trim().min(1, "Informe a descrição."),
  quantidade: z.coerce.number().int().min(1, "Quantidade mínima é 1."),
  precoUnitario: z
    .string()
    .trim()
    .min(1, "Informe o preço.")
    .refine((v) => !Number.isNaN(Number(v.replace(",", "."))), "Preço inválido."),
});
export type ItemOrcamentoInput = z.infer<typeof itemOrcamentoSchema>;
