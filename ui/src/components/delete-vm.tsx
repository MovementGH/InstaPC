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

export default function DeleteVM({ id, name, os }: { id: string, name: string, os: string }) {
    function tryDelete() {
        fetch(`${API_ROUTE}/vm/${id}`, {
            method: "DELETE"
        })
            .then((res) => console.log(res.status))
            .catch((err) => console.log(err))
    }

    return (
        <Dialog>
            <DialogTrigger title={`Delete ${name} (${os})`}><Trash2 className="text-gray-400 hover:text-gray-300 size-4"/></DialogTrigger>
            <DialogContent>
                <DialogHeader>
                <DialogTitle>{`Are you sure you want to delete ${name} (${os})?`}</DialogTitle>
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
        // <button title={`Delete ${name} (${os})`} onClick={tryDelete}>
        //     <Trash2 className="text-gray-400 hover:text-gray-300 size-4"/>
        // </button>
    )
}