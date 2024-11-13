import { Outlet, useLocation } from "react-router-dom"

export default function Dashboard() {
    return (
        <>
            {useLocation().pathname === '/dashboard' &&
                <h1>Dashboard</h1>
            }
            <Outlet />
        </>
    )
}
