import useStatus from "@/hooks/use-status"
import { API_ROUTE } from "@/lib/utils";
import { CirclePower } from "lucide-react";
import { useAuthInfo } from '@propelauth/react';

export default function ShutdownVM({ id }: { id: string }) {
    const authInfo = useAuthInfo();
    const [isOnline, setIsOnline] = useStatus(id);

    function tryShutdown() {
        fetch(`${API_ROUTE}/vm/${id}/stop`, { method: 'POST', headers: {'content-type': 'application/json', authorization: `Bearer ${authInfo.accessToken}`}, })
            .then((res) => res.status == 200 && setIsOnline(false))
            .catch((err) => console.log(err))
    }

    return (
        <button title="Shutdown">
            <CirclePower className="text-orange-300 hover:text-red-600 size-4" onClick={tryShutdown} />
        </button>
    )
}