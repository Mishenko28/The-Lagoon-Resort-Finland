import '../styles/configurations.css'
import { Outlet, useLocation, Link } from "react-router-dom"

export default function Configuration() {
    return (
        <>
            {useLocation().pathname === '/configuration' &&
                <div className='big-navs-cont'>
                    <div className='big-navs'>
                        <Link to="/configuration/room">ROOMS</Link>
                        <Link to="/configuration/amenity">AMENITIES</Link>
                        <Link to="/configuration/gallery">GALLERY</Link>
                        <Link to="/configuration/about-us">ABOUT US</Link>
                    </div>
                </div>
            }
            <Outlet />
        </>
    )
}
