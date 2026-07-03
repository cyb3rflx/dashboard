import { me } from "@/api/auth";
import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router";
import type { User } from "@/api/auth";


export function ProtectedRoute() {
    const [status, setStatus] = useState<"loading" | "ok" | "unauthorized">("loading")
    const [user, setUser] = useState<User | null>(null)

    useEffect(() => {
        async function checkAuth(){
            try {
                setUser(await me())
                setStatus("ok")
            } catch {
                setStatus("unauthorized")
            }
        }

        checkAuth()
    }, [])

    if (status === "loading") {
        return null
    }

    if (status === "unauthorized") {
        return <Navigate to={"/login"} replace />
    }
    return <Outlet context={user}/>

}