import { describe, expect, it } from "vitest";

import {
  clienteSchema,
  usuarioSchema,
  especificadorSchema,
} from "@/lib/validators/contatos";

describe("clienteSchema", () => {
  it("aceita um cliente válido apenas com nome", () => {
    const result = clienteSchema.safeParse({ nome: "Maria Silva" });
    expect(result.success).toBe(true);
  });

  it("rejeita nome vazio", () => {
    const result = clienteSchema.safeParse({ nome: "" });
    expect(result.success).toBe(false);
  });

  it("rejeita e-mail inválido", () => {
    const result = clienteSchema.safeParse({
      nome: "Maria Silva",
      email: "não-é-email",
    });
    expect(result.success).toBe(false);
  });

  it("aceita e-mail em branco como ausente", () => {
    const result = clienteSchema.safeParse({ nome: "Maria Silva", email: "" });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.email).toBeUndefined();
    }
  });
});

describe("especificadorSchema", () => {
  it("exige o nome", () => {
    const result = especificadorSchema.safeParse({ nome: "  " });
    expect(result.success).toBe(false);
  });
});

describe("usuarioSchema", () => {
  it("exige senha com ao menos 6 caracteres quando informada", () => {
    const result = usuarioSchema.safeParse({
      nome: "Fulano",
      email: "fulano@email.com",
      papel: "VENDEDOR",
      ativo: "true",
      senha: "123",
    });
    expect(result.success).toBe(false);
  });

  it("aceita usuário sem senha (edição sem trocar senha)", () => {
    const result = usuarioSchema.safeParse({
      nome: "Fulano",
      email: "fulano@email.com",
      papel: "VENDEDOR",
      ativo: "true",
      senha: "",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.senha).toBeUndefined();
    }
  });

  it("rejeita papel inválido", () => {
    const result = usuarioSchema.safeParse({
      nome: "Fulano",
      email: "fulano@email.com",
      papel: "GERENTE",
      ativo: "true",
    });
    expect(result.success).toBe(false);
  });
});
