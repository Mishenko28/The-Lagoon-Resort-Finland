import { Outlet, useLocation } from "react-router-dom"

export default function Help() {
    return (
        <>
            {useLocation().pathname === '/help' &&
                <h1>Help</h1>
            }
            <Outlet />
        </>
    )
}
