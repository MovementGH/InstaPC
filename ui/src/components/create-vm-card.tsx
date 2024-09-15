import { SquarePlus } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import CreateVMForm from "./create-vm-form";

function CreateVMTrigger() {
  return (
    <div
      className="overflow-hidden group relative flex flex-col justify-center items-center rounded-sm border-muted-foreground border-2 border-solid hover:border-primary transition-all duration-75 ease-in-out hover:cursor-pointer p-16"
      title="Create New PC"
    >
      <SquarePlus className="size-16 text-muted-foreground group-hover:text-primary transition-all duration-75 ease-in-out mb-1" />
    </div>
  );
}

export default function CreateVMCard({ fetchVMs }: { fetchVMs: () => void}) {
  return (
    <Sheet>
      <SheetTrigger>
        <CreateVMTrigger />
      </SheetTrigger>
      <SheetContent onPointerDownOutside={(e) => e.preventDefault()} className="bg-gray-950">
        <SheetHeader>
          <SheetTitle>Create a New PC</SheetTitle>
          <SheetDescription>Configure your new PC.</SheetDescription>
        </SheetHeader>
        <CreateVMForm fetchVMs={fetchVMs} />
      </SheetContent>
    </Sheet>
  );
}
