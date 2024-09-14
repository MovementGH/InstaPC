import { Computer } from "lucide-react";
import VMList from "@/components/vm-list";
import CreateVMForm from "@/components/create-vm-form";

export default function Home() {
  return (
    <main className="flex flex-col grow justify-center items-center p-4 w-full">
      <div className="max-w-7xl w-full mt-12">
        <h1 className="font-bold text-xl mb-4 text-gray-300">Available PCs <Computer className="inline ml-1 size-5 mb-1"/></h1>
        <VMList />
      </div>
    </main>
  );
}
