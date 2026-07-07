import { useEffect, useState } from "react";
import type { Item } from "@/api/items";
import { deleteItem, getItems } from "@/api/items";

import { MoreHorizontalIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export function ItemsTable() {
    const [status, setStatus] = useState<"ok" | "loading" | "unauthorized">("loading")
    const [items, setItems] = useState<Item[]>([])

    useEffect(() => {
       async function loadItems() {
        try {
            setItems(await getItems())
            setStatus("ok")
        } catch {
            setStatus("unauthorized")
        }
       }

       loadItems()
    }, [])

    if (status == "loading") {
        return <p>Loading...</p>
    }

    if (status == "unauthorized") {
        return <p>Could not load items.</p>
    }

    async function handleDelete(item_id: string) {
        await deleteItem(item_id)
        setItems(await getItems())
    }

    const listItems = items.map(item =>
        <TableRow key={item.id}>
            <TableCell className="font-medium">{item.title}</TableCell>
            <TableCell>{item.description}</TableCell>
            <TableCell>{item.created_at}</TableCell>
            <TableCell>{item.updated_at}</TableCell>
            <TableCell className="text-right">
                <DropdownMenu>                    
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="size-8">
                        <MoreHorizontalIcon />
                        <span className="sr-only">Open menu</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>Duplicate</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem variant="destructive" onClick={() => handleDelete(item.id)}>
                        Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </TableCell>
        </TableRow>
    )
    
    return (
        <Table>
            <TableHeader>
                <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Created at</TableHead>
                <TableHead>Updated at</TableHead>
                <TableHead className="text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {listItems}
            </TableBody>
        </Table>
    )


}