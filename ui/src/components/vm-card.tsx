import Image  from "next/image";
import { CirclePower, Plug, SquarePen } from "lucide-react";
import DeleteVM from "./delete-vm";
import { OS, OS_UI_NAMES, VMData } from "@/entities";
import VMStatus from "./vm-status";
import WindowsImage from "public/windows-logo.jpg"
import ShutdownVM from "./shutdown-vm";
import useStatus from "@/hooks/use-status";

export default function VMCard({ vmData }: { vmData: VMData }) {
    const [isOnline, _] = useStatus(vmData.id);

    return (<div className="overflow-hidden group relative flex flex-col justify-center items-center rounded-sm border-gray-800 border-2 border-solid hover:border-primary transition-all duration-75 ease-in-out w-52 h-32 md:w-64 md:h-40 xl:w-72 xl:h-44">
        <div className="relative group-hover:cursor-pointer flex flex-col justify-center items-center size-full gap-2" title={`Connect to ${name} (${vmData.os})`}>
            <Plug className="z-10 size-16 hidden group-hover:block"/>
            <Image
                src={WindowsImage}
                className="absolute size-full object-cover group-hover:blur-sm group-hover:brightness-90"
                alt="Windows VM"
            />
        </div>
        <div className="flex flex-row justify-between items-center w-full bg-gray-700 bottom-0 py-2 px-3 text-muted">
            <div className="flex items-center gap-2">
                <VMStatus id={vmData.id}/>
                <p className="font-medium text-sm">{`${name} (${OS_UI_NAMES[vmData.os]})`}</p>
            </div>
            <div className="flex gap-x-3">
                {
                    isOnline ? <ShutdownVM id={vmData.id} /> : null
                }
                <button title="Edit">
                    <SquarePen className="text-muted hover:text-muted/80 size-4"/>
                </button>
                <DeleteVM id={vmData.id} name={vmData.name} os={vmData.os} />
            </div>
        </div>
    </div>);
}