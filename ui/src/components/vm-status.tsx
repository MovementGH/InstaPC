import useStatus from "@/hooks/use-status";

export default function VMStatus({ id }: { id: string }) {
    const [isOnline,] = useStatus(id);

    return <span title={isOnline ? "Online" : "Offline"} className={`size-3 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'} inline-block`}></span>
}