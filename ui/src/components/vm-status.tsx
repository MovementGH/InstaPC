"use client"
import { API_ROUTE } from "@/lib/utils";
import { useEffect, useState } from "react"

export default function VMStatus({ id, size = 3 }: { id: string, size?: number}) {
    const [isOnline, setIsOnline] = useState(false);

    function updateStatus() {
        fetch(`${API_ROUTE}/vm/${id}/status`)
            .then((res) => res.json())
            .then((data) => (setIsOnline(data)))
            .catch((err) => {
                if (err.status != 404) {
                    console.log(err);
                }
            })
    }

    useEffect(() => {
        updateStatus();
    })

    useEffect(() => {
        const intervalId = setInterval(updateStatus, 5000)

        return () => clearInterval(intervalId);
    }, [isOnline]);

    return <span title={isOnline ? "Online" : "Offline"} className={`size-${size} rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'} inline-block`}></span>
}