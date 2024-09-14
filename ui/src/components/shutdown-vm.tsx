import useStatus from "@/hooks/use-status"
import { API_ROUTE } from "@/lib/utils";
import { CirclePower } from "lucide-react";

export default function ShutdownVM({ id }: { id: string }) {
    const [isOnline, setIsOnline] = useStatus(id);

    function tryShutdown() {
        fetch(`${API_ROUTE}/vm/${id}/stop`)
            .then((res) => res.status == 200 && setIsOnline(false))
            .catch((err) => console.log(err))
    }

    return (
        isOnline &&
        <button title="Shutdown">
            <CirclePower className="text-orange-300 hover:text-red-600 size-4" onClick={tryShutdown} />
        </button>
    )
}