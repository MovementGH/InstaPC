import {z} from "zod";
import VMForm, { vmFormSchema } from "./vm-form";
import { OS, VMData, OS_UI_NAMES } from "@/entities";
import { API_ROUTE } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast"

export default function EditVMForm({ vmData, fetchVMs }: { vmData: VMData, fetchVMs: () => void}) {
  const { toast } = useToast();

  function onSubmit(values: z.infer<typeof vmFormSchema>) {
    const body = {
        "vm": values
    }
    // TODO: Axios call
  }
  
  return (
    <VMForm
      defaultValues={vmData}
      onSubmit={onSubmit}
    />
  )
}