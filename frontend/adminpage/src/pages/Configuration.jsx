import '../styles/configurations.css'
import { Outlet, useLocation } from "react-router-dom"

export default function Configuration() {
    return (
        <>
            {useLocation().pathname === '/configuration' &&
                <h1>Configuration</h1>
            }
            <Outlet />
        </>
    )
}
