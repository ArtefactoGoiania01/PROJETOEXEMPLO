import { AppSidebar } from "@/components/layout/app-sidebar";
import { AppTopbar } from "@/components/layout/app-topbar";

// Sem isso, o Next.js pré-renderiza estaticamente as páginas que buscam
// dados via Prisma (Contatos etc.) — elas mostrariam dados congelados do
// momento do build em vez de consultar o banco a cada acesso.
export const dynamic = "force-dynamic";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-full overflow-hidden">
      <AppSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <AppTopbar />
        <main className="min-h-0 flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
