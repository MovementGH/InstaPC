import {z} from "zod";
import VMForm, { vmFormSchema } from "./vm-form";
import { VMData } from "@/entities";
import { API_ROUTE, getDateString } from "@/lib/utils";
import { toast } from "sonner";
import { useAuthInfo } from '@propelauth/react';

export default function EditVMForm({ vmData, fetchVMs }: { vmData: VMData, fetchVMs: () => void}) {
    const authInfo = useAuthInfo();

  function onSubmit(values: z.infer<typeof vmFormSchema>) {
    const body = {
        "vm": values
    }

    toast.loading(`Applying changes to '${vmData.name}'...`);

    fetch(`${API_ROUTE}/vm/${vmData.id}`, { 
        method: "PATCH",
        body: JSON.stringify(body),
        headers: {'content-type': 'application/json', authorization: `Bearer ${authInfo.accessToken}`},
    })
        .then((res) => {
            if (res.ok) {
              toast.dismiss();
              toast.success(`Succsefully modified '${values.name}'`, {
                description: getDateString(),
              });
              fetchVMs();
            }
            else {
              throw new Error(`Error ${res.status}`);
            }
        })
        .catch((err) => {
          toast.dismiss();
          toast.error("Failed to modify PC due to a server error.", {
            description: err.message
          });
        })
  }
  
  return (
    <VMForm
      defaultValues={vmData}
      onSubmit={onSubmit}
    />
  )
}