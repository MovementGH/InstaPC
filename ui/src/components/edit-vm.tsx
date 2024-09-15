import { VMData } from "@/entities";
import { SquarePen } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import EditVMForm from "./edit-vm-form";

export default function EditVM({
  vmData,
  fetchVMs,
}: {
  vmData: VMData;
  fetchVMs: () => void;
}) {
  return (
    <Sheet>
      <SheetTrigger title="Edit">
        <SquarePen className="text-muted hover:text-muted/80 size-4" />
      </SheetTrigger>
      <SheetContent
        onPointerDownOutside={(e) => e.preventDefault()}
        className="mb-3"
      >
        <SheetHeader>
          <SheetTitle>{`Edit ${vmData.name}`}</SheetTitle>
          <SheetDescription>Configure this PC.</SheetDescription>
        </SheetHeader>
        <EditVMForm vmData={vmData} fetchVMs={fetchVMs} />
      </SheetContent>
    </Sheet>
  );
}
