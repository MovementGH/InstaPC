import { SquarePlus } from "lucide-react";
export default function CreateVMCard() {
    return (<div className="overflow-hidden group relative flex flex-col justify-center items-center rounded-sm border-gray-800 border-2 border-solid hover:border-blue-500 transition-all duration-75 ease-in-out w-52 h-32 md:w-64 md:h-40 xl:w-72 xl:h-44 bg-gray-950 hover:cursor-pointer" title="Create New PC">
            <SquarePlus className="size-16 text-gray-500 group-hover:text-blue-500 transition-all duration-75 ease-in-out mb-1" />
    </div>);
}