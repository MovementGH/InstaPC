"use client"
import VMCard, { VMCardProps } from "@/components/vm-card";
import WindowsImage from "public/windows-logo.jpg"
import CreateVMCard from "@/components/create-vm-card";
import { useEffect, useState } from "react";
import { VMData, OS } from "@/entities";
import { API_ROUTE } from "@/lib/utils";

export default function VMList() {
    const [vmCards, setVMCards] = useState<VMCardProps[]>([]);

    function fetchVMs() {
        fetch(`${API_ROUTE}/vms`)
            .then(res => res.json())
            .then((data) => {
                setVMCards(parseVMData(data));
            })
            .catch((err) => {
                console.log(err);
            });
    }

    function parseVMData(data: VMData[]): VMCardProps[] {
        // Parse VM data into props for VM cards
        let props: VMCardProps[] = [];
        
        for (const item of data) {
            props.push(                {
                name: item.name,
                os: item.os,
                img: WindowsImage,
                id: item.id
            });
        }

        return props;
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
                vmCards.map((item: VMCardProps, index: number) => (
                    <VMCard
                        name={item.name}
                        os={item.os}
                        img={item.img}
                        id={item.id}
                        key={index}
                    />
                ))
            }
            <CreateVMCard fetchVMs={fetchVMs} />
        </section>
    );
}