import { CircleUser, House, LogOut } from "lucide-react";
import Link from "next/link";
import { useAuthInfo, useLogoutFunction } from "@propelauth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function Nav() {
  const authInfo = useAuthInfo();
  const logout = useLogoutFunction()

  return (
    <nav className="flex flex-col grow items-center gap-8 p-6">
      <DropdownMenu>
        <DropdownMenuTrigger className="outline-none"><CircleUser className="size-7 text-muted hover:text-muted/80" /></DropdownMenuTrigger>
        <DropdownMenuContent className="mt-1 ml-4">
          <DropdownMenuLabel className="font-medium text-xs">Currently logged in as:</DropdownMenuLabel>
          <DropdownMenuLabel>{authInfo.user?.email}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="hover:cursor-pointer" onClick={() => logout(true)}><LogOut className="inline mr-1 size-4"/>Log Out</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </nav>
  );
}
