import { API_ROUTE } from "@/lib/utils";
import { useState, useEffect, Dispatch, SetStateAction } from "react";
import { useAuthInfo } from '@propelauth/react';

// Hook for getting status of a vm
export default function useStatus(id: string): [boolean, Dispatch<SetStateAction<boolean>>] {
    const authInfo = useAuthInfo();
    const [isOnline, setIsOnline] = useState(false);

    function updateStatus() {
        fetch(`${API_ROUTE}/vm/${id}/status`, { headers: {'content-type': 'application/json', authorization: `Bearer ${authInfo.accessToken}`} })
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

    return [isOnline, setIsOnline];
}