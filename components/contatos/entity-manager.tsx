"use client";

import { useState, useTransition } from "react";
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { commonLabels } from "@/lib/labels/pt-BR";

export type EntityField = {
  name: string;
  label: string;
  type: "text" | "email" | "tel" | "textarea" | "select" | "password";
  options?: { value: string; label: string }[];
  placeholder?: string;
  helpText?: string;
};

export type EntityColumn = {
  key: string;
  label: string;
};

type ActionResult = { error?: string };

export function EntityManager<
  T extends {
    id: string;
    formValues: Record<string, string>;
    cells: Record<string, React.ReactNode>;
  },
>({
  title,
  novoLabel,
  fields,
  columns,
  items,
  onCreate,
  onUpdate,
  onDelete,
}: {
  title: string;
  novoLabel: string;
  fields: EntityField[];
  columns: EntityColumn[];
  items: T[];
  onCreate: (formData: FormData) => Promise<ActionResult>;
  onUpdate: (id: string, formData: FormData) => Promise<ActionResult>;
  onDelete: (id: string) => Promise<ActionResult>;
}) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<T | null>(null);
  const [error, setError] = useState<string | undefined>();
  const [isPending, startTransition] = useTransition();

  function openCreate() {
    setEditing(null);
    setError(undefined);
    setOpen(true);
  }

  function openEdit(item: T) {
    setEditing(item);
    setError(undefined);
    setOpen(true);
  }

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = editing
        ? await onUpdate(editing.id, formData)
        : await onCreate(formData);
      if (result?.error) {
        setError(result.error);
        return;
      }
      setOpen(false);
      setEditing(null);
    });
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      await onDelete(id);
    });
  }

  const defaultValues = editing ? editing.formValues : {};

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">{title}</h1>
        <Button size="sm" onClick={openCreate}>
          <Plus />
          {novoLabel}
        </Button>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((col) => (
                <TableHead key={col.key}>{col.label}</TableHead>
              ))}
              <TableHead className="w-24 text-right">
                {commonLabels.acoes}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length + 1}
                  className="py-8 text-center text-muted-foreground"
                >
                  {commonLabels.semResultados}
                </TableCell>
              </TableRow>
            ) : (
              items.map((item) => (
                <TableRow key={item.id}>
                  {columns.map((col) => (
                    <TableCell key={col.key}>{item.cells[col.key]}</TableCell>
                  ))}
                  <TableCell>
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEdit(item)}
                        title={commonLabels.editar}
                      >
                        <Pencil className="size-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            title={commonLabels.excluir}
                          >
                            <Trash2 className="size-4 text-destructive" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              {commonLabels.confirmarExclusao}
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              {commonLabels.confirmarExclusaoDescricao}
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>
                              {commonLabels.cancelar}
                            </AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(item.id)}
                            >
                              {commonLabels.excluir}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editing ? commonLabels.editar : novoLabel}
            </DialogTitle>
          </DialogHeader>
          <form action={handleSubmit} className="flex flex-col gap-4">
            {fields.map((field) => (
              <div key={field.name} className="flex flex-col gap-2">
                <Label htmlFor={field.name}>{field.label}</Label>
                {field.type === "textarea" ? (
                  <Textarea
                    id={field.name}
                    name={field.name}
                    placeholder={field.placeholder}
                    defaultValue={defaultValues[field.name] ?? ""}
                  />
                ) : field.type === "select" ? (
                  <Select
                    name={field.name}
                    defaultValue={defaultValues[field.name] ?? undefined}
                  >
                    <SelectTrigger id={field.name}>
                      <SelectValue placeholder={field.placeholder} />
                    </SelectTrigger>
                    <SelectContent>
                      {field.options?.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    id={field.name}
                    name={field.name}
                    type={field.type}
                    placeholder={field.placeholder}
                    defaultValue={defaultValues[field.name] ?? ""}
                  />
                )}
                {field.helpText ? (
                  <p className="text-xs text-muted-foreground">
                    {field.helpText}
                  </p>
                ) : null}
              </div>
            ))}

            {error ? <p className="text-sm text-destructive">{error}</p> : null}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                {commonLabels.cancelar}
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? <Loader2 className="animate-spin" /> : null}
                {commonLabels.salvar}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
