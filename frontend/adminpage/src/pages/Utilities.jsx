import '../styles/utilities.css'
import { Outlet, useLocation, Link } from "react-router-dom"

export default function Utilities() {
    return (
        <>
            {useLocation().pathname === '/utilities' &&
                <div className='big-navs-cont'>
                    <div className='big-navs'>
                        <Link to="/utilities/archive">ARCHIVE</Link>
                        <Link to="/utilities/activity-logs">ACTIVITY LOGS</Link>
                        <Link to="/utilities/database">DATABASE</Link>
                        <Link to="/utilities/users">USERS</Link>
                        <Link to="/utilities/admins">ADMINS</Link>
                    </div>
                </div>
            }
            <Outlet />
        </>
    )
}
