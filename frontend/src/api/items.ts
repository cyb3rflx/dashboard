import { API_URL } from "./auth"

export type Item = {
    id: string
    title: string
    description: string | null
    created_at: string
    updated_at: string
}

export async function getItems(): Promise<Item[]> {
    const response = await fetch(`${API_URL}/items`, {
        method: "GET",
        credentials: "include",
    })
    if (!response.ok) {
        const data = await response.json()
        throw new Error(data.detail ?? "Loading items failed")
    }
    return response.json()
}

export async function createItem(title: string, description?: string): Promise<Item> {
    const response = await fetch(`${API_URL}/items`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        credentials: "include",
        body: JSON.stringify({
            title: title,
            description: description,
        }),
    })
    if (!response.ok) {
        const data = await response.json()
        throw new Error(data.detail ?? "Create item failed")
    }
    return response.json()
}

export async function updateItem(item_id: string, title: string, description: string): Promise<Item> {
    const response = await fetch(`${API_URL}/items/${item_id}`, {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        credentials: "include",
        body: JSON.stringify({
            title: title,
            description: description,
        }),
    })
    if (!response.ok) {
        const data = await response.json()
        throw new Error(data.detail ?? "Update item failed")
    }
    return response.json()
}

export async function deleteItem(item_id: string): Promise<void> {
    const response = await fetch(`${API_URL}/items/${item_id}`, {
        method: "DELETE",
        credentials: "include",
    })
    if (!response.ok) {
        throw new Error("Delete item failed")
    }
}