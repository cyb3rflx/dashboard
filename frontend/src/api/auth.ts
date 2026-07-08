import { API_URL, apiFetch } from "./client"

export type User = {
    id: string
    username: string
    email: string
    created_at: string
}

export async function register(username: string, email: string, password: string) {
    const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        credentials: "include",
        body: JSON.stringify({
            username: username,
            email: email,
            password: password,
        }),
    })
    if (!response.ok) {
        const data = await response.json()
        throw new Error(data.detail ?? "Registration failed")
    }
    return response.json()
}

// Plain fetch: 401 heißt hier "falsches Passwort", nicht "Session abgelaufen"
// -> darf nicht vom apiFetch-Wrapper zu /login umgeleitet werden
export async function login(email: string, password: string) {
    const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        credentials: "include",
        body: JSON.stringify({
            email: email,
            password: password,
        }),
    })
    if (!response.ok) {
        const data = await response.json()
        throw new Error(data.detail ?? "Login failed")
    }
    return response.json()
}

export async function me(): Promise<User> {
    const response = await apiFetch(`/auth/me`)

    if (!response.ok) {
        const data = await response.json()
        throw new Error(data.detail ?? "Authorization failed")
    }
    return response.json()
}

export async function logout() {
    const response = await apiFetch(`/auth/logout`, {
        method: "POST",
    })

    if (!response.ok) {
        const data = await response.json()
        throw new Error(data.detail ?? "Logout failed")
    }
    return response.json()
}