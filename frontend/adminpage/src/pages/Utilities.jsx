import '../styles/utilities.css'
import { Outlet, useLocation } from "react-router-dom"

export default function Utilities() {
    return (
        <>
            {useLocation().pathname === '/utility' &&
                <h1>Utilities</h1>
            }
            <Outlet />
        </>
    )
}
