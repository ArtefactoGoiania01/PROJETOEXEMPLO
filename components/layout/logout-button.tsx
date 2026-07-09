import { LogOut } from "lucide-react";

import { signOut } from "@/auth";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

export function LogoutButton() {
  return (
    <form
      action={async () => {
        "use server";
        await signOut({ redirectTo: "/login" });
      }}
      className="w-full"
    >
      <DropdownMenuItem asChild variant="destructive">
        <button type="submit" className="w-full">
          <LogOut />
          Sair
        </button>
      </DropdownMenuItem>
    </form>
  );
}
