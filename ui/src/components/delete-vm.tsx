"use client"
import { Trash2 } from "lucide-react"
import { API_ROUTE } from "@/lib/utils";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { Button } from "./ui/button";
import { OS, OS_UI_NAMES } from "@/entities";
import { useAuthInfo } from '@propelauth/react';
import { toast } from "sonner";
import { useState } from "react";

export default function DeleteVM({ id, name, os, fetchVMs }: { id: string, name: string, os: OS, fetchVMs: () => void}) {
    const authInfo = useAuthInfo();
    const [dialogOpen, setDialogOpen] = useState(false);

    function tryDelete() {
        fetch(`${API_ROUTE}/vm/${id}`, {
            method: "DELETE",
            headers: {'content-type': 'application/json', authorization: `Bearer ${authInfo.accessToken}`},
        })
            .then((res) => {
                if (res.ok) {
                    toast.dismiss();
                    toast.success("Successfully deleted.");
                    fetchVMs();
                    return;
                }
                throw new Error(`Error ${res.status}`);
            })
            .catch((err: Error) => {
                toast.dismiss();
                toast.error("Failed to delete PC due to a server error.", {
                    description: err.message
                });
            })
            .finally(() => {
                setDialogOpen(false);
            })
    }

    return (
        <Dialog open={dialogOpen} onOpenChange={() => setDialogOpen(!dialogOpen)}>
            <DialogTrigger title={`Delete ${name} (${OS_UI_NAMES[os]})`}><Trash2 className="text-muted hover:text-muted/80 size-4"/></DialogTrigger>
            <DialogContent>
                <DialogHeader>
                <DialogTitle>{`Are you sure you want to delete ${name} (${OS_UI_NAMES[os]})?`}</DialogTitle>
                <DialogDescription>
                    This action cannot be undone.
                </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button onClick={tryDelete}>Yes</Button>
                    <DialogClose asChild>
                        <Button variant="outline">No</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}