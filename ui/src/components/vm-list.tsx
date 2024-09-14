"use client"
import VMCard from "@/components/vm-card";
import CreateVMCard from "@/components/create-vm-card";
import { useEffect, useState } from "react";
import { VMData } from "@/entities";
import { API_ROUTE } from "@/lib/utils";

export default function VMList() {
    const [vmCards, setVMCards] = useState<VMData[]>([]);

    function fetchVMs() {
        fetch(`${API_ROUTE}/vms`)
            .then(res => res.json())
            .then((data) => {
                setVMCards(data);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    useEffect(() => {
        fetchVMs();
    }, []);

    
    useEffect(() => {
        const intervalId = setInterval(fetchVMs, 5000);

        return () => clearInterval(intervalId);

    }, [vmCards]);

    return (
        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-6 gap-x-4">
            {
                vmCards.map((item: VMData, index: number) => (
                    <VMCard vmData={item} key={index}/>
                ))
            }
            <CreateVMCard fetchVMs={fetchVMs} />
        </section>
    );
}