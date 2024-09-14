import Image, { StaticImageData } from "next/image";
import { CirclePower, Plug, SquarePen, Trash2 } from "lucide-react";
import DeleteVM from "./delete-vm";
import { OS, OS_UI_NAMES } from "@/entities";
import VMStatus from "./vm-status";

export interface VMCardProps {
    name: string;
    os: OS;
    img: StaticImageData;
    id: string;
}

function Dot({ online, className }: { online: boolean, className?: string}) {
    return <span title={online ? "Online" : "Offline"} className={`size-3 rounded-full ${online ? 'bg-green-500' : 'bg-red-500'} inline-block ${className}`}></span>
}

export default function VMCard({ name, os, img, id }: VMCardProps) {
    // TODO: retrieve from api
    const online = false;

    return (<div className="overflow-hidden group relative flex flex-col justify-center items-center rounded-sm border-gray-800 border-2 border-solid hover:border-blue-500 transition-all duration-75 ease-in-out w-52 h-32 md:w-64 md:h-40 xl:w-72 xl:h-44 bg-gray-950">
        <div className="relative group-hover:cursor-pointer flex flex-col justify-center items-center size-full gap-2" title={`Connect to ${name} (${os})`}>
            <Plug className="z-10 size-16 hidden group-hover:block"/>
            <Image
                src={img}
                className="absolute size-full object-cover group-hover:blur-sm group-hover:brightness-90"
                alt="Windows VM"
            />
        </div>
        <div className="flex flex-row justify-between items-center w-full bg-gray-700 bottom-0 py-2 px-3 text-gray-300">
            <div className="flex items-center gap-2">
                <VMStatus id={id}/>
                <p className="font-medium text-sm">{`${name} (${OS_UI_NAMES[os]})`}</p>
            </div>
            <div className="flex gap-x-3">
                {
                    online &&
                    <button title="Shutdown">
                        <CirclePower className="text-orange-300 hover:text-red-600 size-4" />
                    </button>
                }
                <button title="Edit">
                    <SquarePen className="text-gray-400 hover:text-gray-300 size-4"/>
                </button>
                <DeleteVM id={id} name={name} os={os} />
            </div>
        </div>
    </div>);
}