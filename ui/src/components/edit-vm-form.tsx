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

    fetch(`${API_ROUTE}/vm`, { 
        method: "POST",
        body: JSON.stringify(body),
        headers: {'content-type': 'application/json', authorization: `Bearer ${authInfo.accessToken}`},
    })
        .then((res) => {
            if (res.status == 200) {
                toast(`Succsefully modified PC '${values.name}'`, {
                  description: getDateString(),
                });
                fetchVMs();
            }
        })
        .catch((err) => console.log(err))
  }
  
  return (
    <VMForm
      defaultValues={vmData}
      onSubmit={onSubmit}
    />
  )
}