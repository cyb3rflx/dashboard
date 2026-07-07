import { useEffect, useState } from "react";
import type { Item } from "@/api/items";
import { getItems } from "@/api/items";

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

    const dropdownMenu = 
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
                <DropdownMenuItem variant="destructive">
                Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>

    const listItems = items.map(item =>
        <TableRow>
            <TableCell className="font-medium">{item.title}</TableCell>
            <TableCell>{item.description}</TableCell>
            <TableCell>{item.created_at}</TableCell>
            <TableCell>{item.updated_at}</TableCell>
            <TableCell className="text-right">
                {dropdownMenu}
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