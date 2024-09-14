import Image, { StaticImageData } from "next/image";
import { CirclePower, Plug, SquarePen, Trash2 } from "lucide-react";

export interface VMCardProps {
    name: string;
    os: string;
    img: StaticImageData;
    online: boolean;
    id: string;
}

function Dot({ online, className }: { online: boolean, className?: string}) {
    return <span className={`size-3 rounded-full ${online ? 'bg-green-500' : 'bg-red-500'} inline-block ${className}`}></span>
}

export default function VMCard({ name, os, img, online, id }: VMCardProps) {
    return (<div className="overflow-hidden group relative flex justify-center items-center rounded-sm border-gray-800 border-2 border-solid hover:border-blue-500 transition-all duration-75 ease-in-out w-52 h-32 md:w-64 md:h-40 xl:w-72 xl:h-44 bg-gray-950">
        <div className="relative z-10 group-hover:cursor-pointer flex flex-col justify-center items-center size-full gap-2">
            <Plug className="size-16 hidden group-hover:block"/>
            <div className="flex flex-row justify-between items-center absolute w-full bg-gray-700 bottom-0 py-2 px-3 text-gray-300">
                <div className="flex items-center gap-2">
                    <Dot online={online} />
                    <p className="font-medium text-sm">{`${name} (${os})`}</p>
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
                    <button title="Delete">
                        <Trash2 className="text-gray-400 hover:text-gray-300 size-4"/>
                    </button>
                </div>
            </div>
        </div>
        <Image
            src={img}
            className="absolute size-full object-cover group-hover:blur-sm group-hover:brightness-90"
            alt="Windows VM"
        />
    </div>);
}