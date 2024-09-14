import { SquarePlus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import CreateVMForm from "./create-vm-form";

function CreateVMTrigger() {
  return (
    <div
      className="overflow-hidden group relative flex flex-col justify-center items-center rounded-sm border-muted-foreground border-2 border-solid hover:border-primary transition-all duration-75 ease-in-out w-52 h-32 md:w-64 md:h-40 xl:w-72 xl:h-44hover:cursor-pointer"
      title="Create New PC"
    >
      <SquarePlus className="size-16 text-muted-foreground group-hover:text-primary transition-all duration-75 ease-in-out mb-1" />
    </div>
  );
}

export default function CreateVMCard({ fetchVMs }: { fetchVMs: () => void}) {
  return (
    <Dialog>
      <DialogTrigger>
        <CreateVMTrigger />
      </DialogTrigger>
      <DialogContent onPointerDownOutside={(e) => e.preventDefault()} className="bg-gray-950">
        <DialogHeader>
          <DialogTitle>Create a New PC</DialogTitle>
          <DialogDescription>Configure your new PC.</DialogDescription>
        </DialogHeader>
        <CreateVMForm fetchVMs={fetchVMs} />
      </DialogContent>
    </Dialog>
  );
}
