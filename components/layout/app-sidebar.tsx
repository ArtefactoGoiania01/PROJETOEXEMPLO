"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { sidebarNav } from "./nav-config";

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-16 shrink-0 flex-col items-center gap-1 border-r bg-card py-4">
      <div className="mb-4 flex size-9 items-center justify-center rounded-lg bg-primary font-bold text-primary-foreground">
        CM
      </div>
      <nav className="flex flex-col items-center gap-1">
        {sidebarNav.map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              title={item.label}
              className={cn(
                "flex size-11 flex-col items-center justify-center gap-0.5 rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground",
                active && "bg-accent text-accent-foreground",
              )}
            >
              <Icon className="size-5" />
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
