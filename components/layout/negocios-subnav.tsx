"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Search } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { negociosSubmenu } from "./nav-config";

const abas = [
  { href: "/negocios/orcamentos", label: "Lista de orçamentos" },
  { href: "/negocios", label: "Funil de vendas" },
  { href: "/agenda", label: "Agenda" },
];

export function NegociosSubnav() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col gap-3 border-b bg-card px-4 py-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                Negócios
                <ChevronDown className="size-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {negociosSubmenu.map((item) => (
                <DropdownMenuItem key={item.href} asChild>
                  <Link href={item.href}>{item.label}</Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <nav className="flex items-center gap-1">
            {abas.map((aba) => {
              const active =
                aba.href === "/negocios"
                  ? pathname === "/negocios"
                  : pathname.startsWith(aba.href);
              return (
                <Link
                  key={aba.href}
                  href={aba.href}
                  className={cn(
                    "rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                    active && "bg-accent text-accent-foreground",
                  )}
                >
                  {aba.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="hidden md:inline-flex">
            Funil de vendas: VENDAS
            <ChevronDown className="size-3.5" />
          </Button>
          <div className="relative">
            <Search className="pointer-events-none absolute left-2 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Nome, CPF, CNPJ ou b..."
              className="h-8 w-52 pl-7"
            />
          </div>
          <Button variant="outline" size="sm">
            Filtrar Cartões
          </Button>
        </div>
      </div>
    </div>
  );
}
