"use client";

import { useState, useTransition } from "react";
import { Loader2, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatarMoeda } from "@/lib/labels/pt-BR";
import { adicionarItem, removerItem } from "@/app/(app)/negocios/[id]/orcamento/actions";

type Item = {
  id: string;
  descricao: string;
  quantidade: number;
  precoUnitario: string;
};

type ProdutoCatalogo = { id: string; nome: string; valorUnitario: string };

export function ItensOrcamento({
  negocioId,
  itens,
  produtos,
}: {
  negocioId: string;
  itens: Item[];
  produtos: ProdutoCatalogo[];
}) {
  const [open, setOpen] = useState(false);
  const [produtoId, setProdutoId] = useState<string | undefined>();
  const [descricao, setDescricao] = useState("");
  const [precoUnitario, setPrecoUnitario] = useState("");
  const [error, setError] = useState<string | undefined>();
  const [isPending, startTransition] = useTransition();

  const total = itens.reduce(
    (soma, item) => soma + item.quantidade * Number(item.precoUnitario),
    0,
  );

  function handleSelectProduto(id: string) {
    setProdutoId(id);
    const produto = produtos.find((p) => p.id === id);
    if (produto) {
      setDescricao(produto.nome);
      setPrecoUnitario(produto.valorUnitario);
    }
  }

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await adicionarItem(negocioId, formData);
      if (result?.error) {
        setError(result.error);
        return;
      }
      setOpen(false);
      setProdutoId(undefined);
      setDescricao("");
      setPrecoUnitario("");
      setError(undefined);
    });
  }

  function handleRemover(itemId: string) {
    startTransition(() => {
      removerItem(negocioId, itemId);
    });
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold">Serviços/Produtos</h2>
        <Button size="sm" onClick={() => setOpen(true)}>
          <Plus />
          Adicionar Produto
        </Button>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Descrição</TableHead>
              <TableHead>Quant.</TableHead>
              <TableHead>Preço un. (R$)</TableHead>
              <TableHead>Total (R$)</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {itens.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                  Nenhum item adicionado.
                </TableCell>
              </TableRow>
            ) : (
              itens.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.descricao}</TableCell>
                  <TableCell>{item.quantidade}</TableCell>
                  <TableCell>{formatarMoeda(item.precoUnitario)}</TableCell>
                  <TableCell>
                    {formatarMoeda(item.quantidade * Number(item.precoUnitario))}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemover(item.id)}
                      disabled={isPending}
                    >
                      <Trash2 className="size-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-end text-sm font-semibold">
        Total do orçamento: {formatarMoeda(total)}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Produto</DialogTitle>
          </DialogHeader>
          <form action={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label>Produto do catálogo (opcional)</Label>
              <Select value={produtoId} onValueChange={handleSelectProduto}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione ou preencha manualmente abaixo" />
                </SelectTrigger>
                <SelectContent>
                  {produtos.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <input type="hidden" name="produtoId" value={produtoId ?? ""} />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="descricao">Descrição</Label>
              <Input
                id="descricao"
                name="descricao"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="quantidade">Quantidade</Label>
                <Input id="quantidade" name="quantidade" type="number" min={1} defaultValue={1} />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="precoUnitario">Preço unitário (R$)</Label>
                <Input
                  id="precoUnitario"
                  name="precoUnitario"
                  value={precoUnitario}
                  onChange={(e) => setPrecoUnitario(e.target.value)}
                  required
                />
              </div>
            </div>

            {error ? <p className="text-sm text-destructive">{error}</p> : null}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? <Loader2 className="animate-spin" /> : null}
                Adicionar
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
