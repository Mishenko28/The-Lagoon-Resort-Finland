import '../styles/navigations.css'
import { NavLink, Outlet } from "react-router-dom";
import { useState } from 'react'
import useAdmin from '../hooks/useAdmin'

export default function Navigations() {
    const { state, dispatch } = useAdmin()

    const [openNav, setOpenNav] = useState("")
    const [openSettings, setOpenSettings] = useState(false)

    const handleOpenNav = (e) => {
        openNav == e.target.innerText ? setOpenNav("") : setOpenNav(e.target.innerText)
    }

    const handleLogout = () => {
        dispatch({ type: 'LOGOUT' })
    }

    return (
        <div className='main-cont'>
            <div className="header-cont">
                <h1>The Lagoon Resort Finland Inc.</h1>
                <div className='profile-cont'>
                    <img src="https://www.w3schools.com/howto/img_avatar.png" alt="profile-pic" />
                    <h3>{state.admin.email}</h3>
                </div>
                <i onClick={() => setOpenSettings(!openSettings)} className="fa-solid fa-ellipsis-vertical" />
            </div >
            <div className='nav-and-con'>
                <div className="navigation-cont">
                    <div className='parent-cont'>
                        <NavLink onClick={handleOpenNav} to='/dashboard'>Dashboard<i className="fa-solid fa-chart-simple" /></NavLink>
                        {openNav === 'Dashboard' &&
                            <div className='child-cont'>
                                <NavLink to='/dashboard/booking'>Bookings<i className="fa-solid fa-book-bookmark" /></NavLink>
                                <NavLink to='/dashboard/report'>Reports<i className="fa-solid fa-chart-line" /></NavLink>
                            </div>
                        }
                    </div>
                    <div className='parent-cont'>
                        <NavLink onClick={handleOpenNav} to='/configuration'>Configuration<i className="fa-solid fa-wrench" /></NavLink>
                        {openNav === 'Configuration' &&
                            <div className='child-cont'>
                                <NavLink to='/dashboard/room'>Rooms<i className="fa-solid fa-building" /></NavLink>
                                <NavLink to='/dashboard/amenity'>Amenities<i className="fa-solid fa-umbrella-beach" /></NavLink>
                                <NavLink to='/dashboard/gallery'>Gallery<i className="fa-solid fa-camera-retro" /></NavLink>
                                <NavLink to='/dashboard/about-us'>About Us<i className="fa-solid fa-location-dot" /></NavLink>
                            </div>
                        }
                    </div>
                    <div className='parent-cont'>
                        <NavLink onClick={handleOpenNav} to='/utility'>Utilities<i className="fa-solid fa-server" /></NavLink>
                        {openNav === 'Utilities' &&
                            <div className='child-cont'>
                                <NavLink to='/utility/archive'>Archive<i className="fa-solid fa-recycle" /></NavLink>
                                <NavLink to='/utility/activity-logs'>Activity Logs<i className="fa-solid fa-folder-closed" /></NavLink>
                                <NavLink to='/utility/gallery'>Database<i className="fa-solid fa-database" /></NavLink>
                                <NavLink to='/utility/about-us'>Users<i className="fa-solid fa-user-gear" /></NavLink>
                                <NavLink to='/utility/about-us'>Admins<i className="fa-solid fa-user-tie" /></NavLink>
                            </div>
                        }
                    </div>
                    <div className='parent-cont'>
                        <NavLink onClick={handleOpenNav} to='/help'>Help<i className="fa-regular fa-circle-question" /></NavLink>
                        {openNav == 'Help' &&
                            <div className='child-cont'>
                                <NavLink to='/help/user-manual'>User Manual<i className="fa-solid fa-circle-info" /></NavLink>
                            </div>
                        }
                    </div>
                </div>
                <div className="content-cont">
                    {openSettings &&
                        <div className='settings-cont'>
                            <button>Button1</button>
                            <button>Button2</button>
                            <button>Button3</button>
                            <button>Button4</button>
                            <button onClick={handleLogout}>Logout<i className="fa-solid fa-right-from-bracket" /></button>
                        </div>
                    }
                    <Outlet />
                </div>
            </div>
        </div>

    )
}
