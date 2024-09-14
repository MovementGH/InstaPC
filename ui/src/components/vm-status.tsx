import useStatus from "@/hooks/use-status";

export default function VMStatus({ id, size = 3 }: { id: string, size?: number}) {
    const isOnline = useStatus(id);

    return <span title={isOnline ? "Online" : "Offline"} className={`size-${size} rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'} inline-block`}></span>
}