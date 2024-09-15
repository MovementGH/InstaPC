import Image  from "next/image";
import { Plug, SquarePen } from "lucide-react";
import DeleteVM from "./delete-vm";
import { OS_UI_NAMES, VMData, OS } from "@/entities";
import VMStatus from "./vm-status";
import ShutdownVM from "./shutdown-vm";
import useStatus from "@/hooks/use-status";
import { useAuthInfo } from "@propelauth/react";
import { API_ROUTE, VM_ROUTE } from "@/lib/utils";
import EditVM from "./edit-vm";
import Win11Img from "public/win11.png";
import Win108Img from "public/win10-8.png";
import Win7XPImg from "public/win7.png";
import WinVistaImg from "public/winvista.png";
import ArchImg from "public/arch-linux.png";
import KaliImg from "public/kali.png";
import UbuntuImg from "public/ubuntu.png";
import MacImg from "public/mac.png";
import { toast } from "sonner";

export const OS_CARD_IMG = {
    [OS.Win11]: Win11Img,
    [OS.Win10]: Win108Img,
    [OS.Win8]: Win108Img,
    [OS.Win7]: Win7XPImg,
    [OS.WinVista]: WinVistaImg,
    [OS.WinXP]: Win7XPImg,
    [OS.Arch]: ArchImg,
    [OS.ArchKDE]: ArchImg,
    [OS.Kali]: KaliImg,
    [OS.Ubuntu2004]: UbuntuImg,
    [OS.Ubuntu2404]: UbuntuImg,
    [OS.MacSonomoa]: MacImg,
    [OS.MacVentura]: MacImg,
    [OS.MacMonterey]: MacImg,
    [OS.MacBigSur]: MacImg
}

export default function VMCard({ vmData, fetchVMs }: { vmData: VMData, fetchVMs: () => void }) {
    const authInfo = useAuthInfo();
    const [isOnline, _] = useStatus(vmData.id);

    function tryConnect() {
        toast.loading(`Connecting to '${vmData.name}'`);
        
        fetch(`${API_ROUTE}/vm/${vmData.id}/connect`, { method: 'POST', headers: {'content-type': 'application/json', authorization: `Bearer ${authInfo.accessToken}`}, })
            .then(result => {
                if (result.ok) {
                    toast.dismiss();
                    return result.json()
                }
                else {
                    throw new Error(`Error ${result.status}`);
                }
            })
            .then(result => {
                window.open(`${VM_ROUTE}/?session=${result}&resize=scale&autoconnect=true`, 'popupWindow', `resizable=yes,width=${screen.width},height=${screen.height}`);
            })
            .catch((err) => {
                console.log(err)
                toast.dismiss();
                toast.error("Failed to connect to PC due to a server error.", {
                  description: err.message
                })
            })
    }

    return (<div className="overflow-hidden group relative flex flex-col justify-center items-center rounded-sm border-gray-800 border-2 border-solid hover:border-primary transition-all duration-75 ease-in-out w-52 h-32 md:w-64 md:h-40 xl:w-72 xl:h-44">
        <div onClick={tryConnect} className="relative group-hover:cursor-pointer flex flex-col justify-center items-center size-full gap-2" title={`Connect to ${vmData.name} (${OS_UI_NAMES[vmData.os]})`}>
            <Plug className="z-10 size-16 hidden group-hover:block"/>
            <Image
                src={OS_CARD_IMG[vmData.os]}
                className="absolute size-full object-cover group-hover:blur-sm group-hover:brightness-90"
                alt="Windows VM"
            />
        </div>
        <div className="flex flex-row justify-between items-center w-full bg-gray-700 bottom-0 py-2 px-3 text-muted">
            <div className="flex items-center gap-2">
                <VMStatus id={vmData.id}/>
                <p className="font-medium text-sm">{`${vmData.name}`}</p>
                <p className="text-xs text-muted/80">{OS_UI_NAMES[vmData.os]}</p>
            </div>
            <div className="flex gap-x-3">
                {
                    isOnline ? <ShutdownVM id={vmData.id} /> : null
                }
                <EditVM vmData={vmData} fetchVMs={fetchVMs} />
                <DeleteVM fetchVMs={fetchVMs} id={vmData.id} name={vmData.name} os={vmData.os} />
            </div>
        </div>
    </div>);
}