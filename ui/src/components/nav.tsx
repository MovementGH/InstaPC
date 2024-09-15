import { BotMessageSquare, CircleUser, LogOut } from "lucide-react";
import { useAuthInfo, useLogoutFunction } from "@propelauth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useState } from "react";
import ChatBotComponent from "@/app/chatbotUI";

export default function Nav() {
  const authInfo = useAuthInfo();
  const logout = useLogoutFunction();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <aside className="flex">
      <nav className="relative flex flex-col grow items-center gap-8 p-6 z-20 bg-background mt-6">
        <DropdownMenu>
          <DropdownMenuTrigger className="outline-none"><CircleUser className="size-7 text-foreground hover:text-foreground/80" /></DropdownMenuTrigger>
          <DropdownMenuContent className="mt-1 ml-4">
            <DropdownMenuLabel className="font-medium text-xs">Currently logged in as:</DropdownMenuLabel>
            <DropdownMenuLabel>{authInfo.user?.email}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="hover:cursor-pointer" onClick={() => logout(true)}><LogOut className="inline mr-1 size-4"/>Log Out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <button onClick={() => setIsOpen(!isOpen)}>
          <BotMessageSquare className="size-7 text-foreground hover:text-foreground/80" />
        </button>
      </nav>
      <ChatBotComponent className={`${isOpen ? 'translate-x-0 relative' : '-translate-x-[300%] absolute'}`}/>
    </aside>
  );
}
