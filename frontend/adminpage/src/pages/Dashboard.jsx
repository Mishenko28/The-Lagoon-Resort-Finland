import "../styles/dashboard.css"
import { Outlet, useLocation, Link } from "react-router-dom"

export default function Dashboard() {
    return (
        <>
            {useLocation().pathname === '/dashboard' &&
                <div className='big-navs-cont'>
                    <div className='big-navs'>
                        <Link to="/dashboard/booking?page=pending">BOOKINGS</Link>
                        <Link to="/dashboard/report">REPORTS</Link>
                    </div>
                </div>
            }
            <Outlet />
        </>
    )
}
