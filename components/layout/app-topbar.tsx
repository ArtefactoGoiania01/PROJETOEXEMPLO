import { User as UserIcon } from "lucide-react";

import { auth } from "@/auth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { papelUsuarioLabels } from "@/lib/labels/pt-BR";
import { LogoutButton } from "./logout-button";

function iniciais(nome: string) {
  return nome
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((parte) => parte[0]?.toUpperCase())
    .join("");
}

export async function AppTopbar() {
  const session = await auth();
  const nome = session?.user?.name ?? "Usuário";
  const papel = session?.user?.papel ?? "";

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b bg-card px-4">
      <span className="text-sm font-semibold">CRM Móveis</span>
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center gap-2 rounded-md px-2 py-1 text-sm hover:bg-accent">
          <Avatar className="size-7">
            <AvatarFallback>{iniciais(nome) || <UserIcon className="size-4" />}</AvatarFallback>
          </Avatar>
          <span className="hidden sm:inline">{nome}</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>
            {nome}
            <div className="font-normal text-xs text-muted-foreground">
              {papelUsuarioLabels[papel] ?? papel}
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <LogoutButton />
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
