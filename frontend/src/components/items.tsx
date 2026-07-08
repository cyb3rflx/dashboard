import React, { useEffect, useState } from "react";
import type { Item } from "@/api/items";
import { createItem, deleteItem, getItems, updateItem } from "@/api/items";

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

import { Field, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"


export function ItemsTable() {
    const [status, setStatus] = useState<"ok" | "loading" | "unauthorized">("loading")
    const [items, setItems] = useState<Item[]>([])
    const [open, setOpen] = useState(false)
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [error, setError] = useState("")
    const [itemId, setItemId] = useState("")
    const [edit, setEdit] = useState(false)

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

    async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>){
        e.preventDefault()
        setError("")
        try {
            if (edit){
                await updateItem(itemId, title, description)
            } else {
                await createItem(title, description)
            }
            setItems(await getItems()) 
            handleOpenChange(false)
        } catch (err) {
            setError(err instanceof Error ? err.message: edit ? "Edit item failed" : "Add item failed")
        }
    }

    function handleEdit(item_id: string, title: string, description: string) {
        setEdit(true)
        setOpen(true)
        setTitle(title)
        setItemId(item_id)
        setDescription(description)
    }

    function handleOpenChange(isOpen: boolean) {
        setOpen(isOpen)
        if (! isOpen) {
            setEdit(false)
            setTitle("")
            setDescription("")
            setError("")
            setItemId("")
        }
    }

    function formatDate(iso: string) {
        return new Date(iso).toLocaleString("de-DE", { dateStyle: "medium", timeStyle: "short"})
    }

    const listItems = items.map(item =>
        <TableRow key={item.id}>
            <TableCell className="font-medium">{item.title}</TableCell>
            <TableCell>{item.description}</TableCell>
            <TableCell>{formatDate(item.created_at)}</TableCell>
            <TableCell>{formatDate(item.updated_at)}</TableCell>
            <TableCell className="text-right">
                <DropdownMenu>                    
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="size-8">
                        <MoreHorizontalIcon />
                        <span className="sr-only">Open menu</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(item.id, item.title, item.description ?? "")}>Edit</DropdownMenuItem>
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
        <>
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-3xl font-bold">Items</h1>
                <Dialog open={open} onOpenChange={handleOpenChange}>
                    <DialogTrigger asChild>
                    <Button variant="outline">Add Item</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-sm">
                        <DialogHeader>
                            <DialogTitle>
                                {edit ? "Edit item" : "Add item"}
                            </DialogTitle>
                            <DialogDescription>
                                {edit ? "Edit the specific item" : "Add an item to your account."}
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            <FieldGroup>
                                <Field>
                                <Label htmlFor="title">Title</Label>
                                <Input id="title" name="title" value={title} onChange={e => setTitle(e.currentTarget.value)}/>
                                </Field>
                                <Field>
                                <Label htmlFor="description">Description</Label>
                                <Textarea id="description" placeholder="Type your description here." value={description} onChange={e => setDescription(e.currentTarget.value)}/>
                                </Field>
                            </FieldGroup>
                            {error && <p className="text-sm text-red-500">{error}</p>}
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button variant="outline">Cancel</Button>
                                </DialogClose>
                                <Button type="submit">
                                    {edit ? "Edit item" : "Add item"}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
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
        </>
    )


}