import {z} from "zod";
import VMForm, { vmFormSchema } from "./vm-form";
import { OS, VMData } from "@/entities";
import { API_ROUTE, getDateString } from "@/lib/utils";
import { toast } from "sonner"
import { useAuthInfo } from '@propelauth/react';

export default function CreateVMForm({ fetchVMs }: { fetchVMs: () => void}) {
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
                toast(`Succsefully created PC '${values.name}'`, {
                  description: getDateString(),
                });
                fetchVMs();
            }
        })
        .catch((err) => console.log(err))
  }

  return (
    <VMForm
      defaultValues={{
        name: "My PC",
        os: OS.Win11,
        memory: 4096,
        cores: 2,
        disk: 32,
      } as VMData}
      onSubmit={onSubmit}
    />
  )
}