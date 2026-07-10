import { z } from "zod";

const optionalString = z
  .string()
  .trim()
  .optional()
  .transform((v) => (v === "" ? undefined : v));

export const clienteSchema = z.object({
  nome: z.string().trim().min(1, "Informe o nome."),
  telefone: optionalString,
  whatsapp: optionalString,
  email: z
    .string()
    .trim()
    .email("E-mail inválido.")
    .optional()
    .or(z.literal(""))
    .transform((v) => (v === "" ? undefined : v)),
  documento: optionalString,
  logradouro: optionalString,
  cidade: optionalString,
  estado: optionalString,
  cep: optionalString,
  obs: optionalString,
});
export type ClienteInput = z.infer<typeof clienteSchema>;

export const escritorioSchema = z.object({
  razaoSocial: z.string().trim().min(1, "Informe a razão social."),
  nomeFantasia: optionalString,
  documento: optionalString,
  contato: optionalString,
});
export type EscritorioInput = z.infer<typeof escritorioSchema>;

export const especificadorSchema = z.object({
  nome: z.string().trim().min(1, "Informe o nome."),
  whatsapp: optionalString,
  email: z
    .string()
    .trim()
    .email("E-mail inválido.")
    .optional()
    .or(z.literal(""))
    .transform((v) => (v === "" ? undefined : v)),
  escritorioId: optionalString,
});
export type EspecificadorInput = z.infer<typeof especificadorSchema>;

export const construtoraSchema = z.object({
  nome: z.string().trim().min(1, "Informe o nome."),
});
export type ConstrutoraInput = z.infer<typeof construtoraSchema>;

export const fabricanteSchema = z.object({
  nome: z.string().trim().min(1, "Informe o nome."),
});
export type FabricanteInput = z.infer<typeof fabricanteSchema>;

export const categoriaProdutoSchema = z.object({
  nome: z.string().trim().min(1, "Informe o nome."),
});
export type CategoriaProdutoInput = z.infer<typeof categoriaProdutoSchema>;

export const usuarioSchema = z.object({
  nome: z.string().trim().min(1, "Informe o nome."),
  email: z.string().trim().email("E-mail inválido."),
  papel: z.enum(["VENDEDOR", "ASSISTENTE", "ADMIN"]),
  ativo: z.enum(["true", "false"]).transform((v) => v === "true"),
  senha: z
    .string()
    .trim()
    .min(6, "A senha deve ter ao menos 6 caracteres.")
    .optional()
    .or(z.literal(""))
    .transform((v) => (v === "" ? undefined : v)),
});
export type UsuarioInput = z.infer<typeof usuarioSchema>;
