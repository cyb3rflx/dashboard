export const API_URL = "http://localhost:8000"

export async function apiFetch(path: string, options: RequestInit = {}) {
    const response = await fetch(`${API_URL}${path}`, {
        credentials: "include",
        ...options,
    })
    if (response.status === 401) {
        window.location.href = "/login"
        throw new Error("Session expired")
    }
    return response
}

