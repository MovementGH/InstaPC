import {z} from "zod";
import VMForm, { vmFormSchema } from "./vm-form";
import { OS, VMData } from "@/entities";
import { API_ROUTE, getDateString } from "@/lib/utils";
import { toast } from "sonner"
import { useAuthInfo } from '@propelauth/react';
import { UseAuthInfoProps } from "@propelauth/react/dist/types/hooks/useAuthInfo";

export function createVM(values: z.infer<typeof vmFormSchema>, authInfo: UseAuthInfoProps, fetchVMs?: () => void) {
  const body = {
    "vm": values
  }

  toast.loading("Creating your PC...");

    fetch(`${API_ROUTE}/vm`, { 
        method: "POST",
        body: JSON.stringify(body),
        headers: {'content-type': 'application/json', authorization: `Bearer ${authInfo.accessToken}`},
    })
        .then((res) => {
            if (res.ok) {
              toast.dismiss();
              toast.success(`Succsefully created '${values.name}'`, {
                description: getDateString(),
              });
              fetchVMs && fetchVMs();
            }
            else {
              throw new Error(`Error ${res.status}`);
            }
        })
        .catch((err) => {
          toast.dismiss();
          toast.error("Failed to create PC due to a server error.", {
            description: err.message
          });
        })
}

export default function CreateVMForm({ fetchVMs }: { fetchVMs: () => void}) {
  const authInfo = useAuthInfo();

  function onSubmit(values: z.infer<typeof vmFormSchema>) {
    createVM(values, authInfo, fetchVMs);
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