import { NegociosSubnav } from "@/components/layout/negocios-subnav";

export default function NegociosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-full flex-col">
      <NegociosSubnav />
      <div className="min-h-0 flex-1 overflow-auto">{children}</div>
    </div>
  );
}
