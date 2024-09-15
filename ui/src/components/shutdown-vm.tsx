import useStatus from "@/hooks/use-status";
import { API_ROUTE } from "@/lib/utils";
import { CirclePower } from "lucide-react";
import { useState } from "react";
import Spinner from "./ui/spinner";
import { useAuthInfo } from "@propelauth/react";

export default function ShutdownVM({ id }: { id: string }) {
  const [_, setIsOnline] = useStatus(id);
  const [isShuttingDown, setIsShuttingDown] = useState(false);
  const authInfo = useAuthInfo();

  function tryShutdown() {
    setIsShuttingDown(true);

    fetch(`${API_ROUTE}/vm/${id}/stop`, { method: "POST", headers: {'content-type': 'application/json', authorization: `Bearer ${authInfo.accessToken}`} })
      .then(() => {
        setIsOnline(false);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setIsShuttingDown(false);
      });
  }

  return (
    <button title="Shutdown">
      {isShuttingDown ? (
        <Spinner className="size-4" />
      ) : (
        <CirclePower
          className="text-orange-300 hover:text-red-600 size-4"
          onClick={tryShutdown}
        />
      )}
    </button>
  );
}
