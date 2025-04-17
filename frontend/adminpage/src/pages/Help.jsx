import { Outlet, useLocation, Link } from "react-router-dom"
import "../styles/help.css"

export default function Help() {
    return (
        <>
            {useLocation().pathname === '/help' &&
                <div className='big-navs-cont'>
                    <div className='big-navs'>
                        <Link to="/help/user-manual">USER MANUAL</Link>
                    </div>
                </div>
            }
            <Outlet />
        </>
    )
}
