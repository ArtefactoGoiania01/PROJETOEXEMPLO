import { ContatosSubnav } from "@/components/layout/contatos-subnav";

export default function ContatosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-full flex-col">
      <ContatosSubnav />
      <div className="min-h-0 flex-1 overflow-auto">{children}</div>
    </div>
  );
}
