import VMCard from "@/components/vm-card";
import WindowsImage from "public/windows-logo.jpg"
import CreateVMCard from "@/components/create-vm-card";
import { Computer } from "lucide-react";

export default function Home() {
  return (
    <main className="flex flex-col grow justify-center items-center p-4 w-full">
      <div className="max-w-7xl w-full mt-12">
        <h1 className="font-bold text-xl mb-4 text-gray-300">Available PCs <Computer className="inline ml-1 size-5 mb-1"/></h1>
        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-6 gap-x-4">
          <VMCard
            name={"My PC"}
            os={"Windows 11"}
            img={WindowsImage}
            online={false}
            id="123"
          />
          <CreateVMCard />
        </section>
      </div>
    </main>
  );
}
