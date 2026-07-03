import { me } from "@/api/auth";
import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router";


export function ProtectedRoute() {
    const [status, setStatus] = useState<"loading" | "ok" | "unauthorized">("loading")

    useEffect(() => {
        async function checkAuth(){
            try {
                await me()
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
    return <Outlet />

}