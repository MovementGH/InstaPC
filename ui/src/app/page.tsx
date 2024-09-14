import Image from "next/image";
import YourApp from "./authscreen";
export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <div> Login Page </div>
      <div className="items-center">
        <YourApp/>
      </div>
    </div>
  );
}
