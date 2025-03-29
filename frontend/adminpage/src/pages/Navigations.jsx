import '../styles/navigations.css'
import { Link, NavLink, Outlet, useLocation } from "react-router-dom"
import { useState, useRef, useEffect } from 'react'
import useAdmin from '../hooks/useAdmin'

export default function Navigations() {
    const { state, dispatch } = useAdmin()
    const path = useLocation().pathname[1]?.toUpperCase() + useLocation().pathname.split("/")[1].slice(1)

    const [openNav, setOpenNav] = useState("")
    const [openSettings, setOpenSettings] = useState(false)

    const settingsRef = useRef(null)
    const settingsBtnRef = useRef(null)

    useEffect(() => {
        setOpenNav(path.toLowerCase())

        const handleClickOutside = (e) => {
            if (settingsRef.current && !settingsRef.current.contains(e.target) && !settingsBtnRef.current.contains(e.target)) {
                setOpenSettings(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])


    const handleOpenNav = (nav) => {
        if (openNav === nav) {
            setOpenNav("")
            return
        }

        setOpenNav(nav)
    }

    const handleLogout = () => {
        dispatch({ type: 'LOGOUT' })
    }

    return (
        <div className='main-cont'>
            <div className="header-cont">
                <h1>The Lagoon Resort Finland Inc.</h1>
                <div className='right-cont'>
                    <Link to='/profile' className='profile-cont'>
                        <img src={state.admin.profile} />
                        <h3>{state.admin.email}</h3>
                    </Link>
                    <i ref={settingsBtnRef} onClick={() => setOpenSettings(!openSettings)} className="fa-solid fa-ellipsis-vertical" />
                </div>
            </div >
            <div className='nav-and-con'>
                <div className="navigation-cont">
                    {['booking', 'reports'].some(section => state.admin.role.includes(section)) &&
                        <div className='parent-cont'>
                            < NavLink onClick={() => handleOpenNav('dashboard')} to='/dashboard'>Dashboard<i className="fa-solid fa-chart-simple" /></NavLink>
                            <div className={`child-cont ${openNav === 'dashboard' ? 'open' : ''}`}>
                                {state.admin.role.includes('booking') && <NavLink to='/dashboard/booking'>Bookings<i className="fa-solid fa-book-bookmark" /></NavLink>}
                                {state.admin.role.includes('reports') && <NavLink to='/dashboard/report'>Reports<i className="fa-solid fa-chart-line" /></NavLink>}
                            </div>
                        </div>
                    }
                    {['room', 'amenity', 'gallery', 'aboutUs'].some(section => state.admin.role.includes(section)) &&
                        <div className='parent-cont'>
                            <NavLink onClick={() => handleOpenNav('configuration')} to='/configuration'>Configuration<i className="fa-solid fa-wrench" /></NavLink>
                            <div className={`child-cont ${openNav === 'configuration' ? 'open' : ''}`}>
                                {state.admin.role.includes('room') && <NavLink to='/configuration/room'>Rooms<i className="fa-solid fa-building" /></NavLink>}
                                {state.admin.role.includes('amenity') && <NavLink to='/configuration/amenity'>Amenities<i className="fa-solid fa-umbrella-beach" /></NavLink>}
                                {state.admin.role.includes('gallery') && <NavLink to='/configuration/gallery'>Gallery<i className="fa-solid fa-camera-retro" /></NavLink>}
                                {state.admin.role.includes('aboutUs') && <NavLink to='/configuration/about-us'>About Us<i className="fa-solid fa-location-dot" /></NavLink>}
                            </div>
                        </div>
                    }
                    {['archive', 'activityLogs', 'database', 'users', 'admins'].some(section => state.admin.role.includes(section)) &&
                        <div className='parent-cont'>
                            <NavLink onClick={() => handleOpenNav('utilities')} to='/utilities'>Utilities<i className="fa-solid fa-server" /></NavLink>
                            <div className={`child-cont ${openNav === 'utilities' ? 'open' : ''}`}>
                                {state.admin.role.includes('archive') && <NavLink to='/utilities/archive'>Archive<i className="fa-solid fa-recycle" /></NavLink>}
                                {state.admin.role.includes('activityLogs') && <NavLink to='/utilities/activity-logs'>Activity Logs<i className="fa-solid fa-folder-closed" /></NavLink>}
                                {state.admin.role.includes('database') && <NavLink to='/utilities/database'>Database<i className="fa-solid fa-database" /></NavLink>}
                                {state.admin.role.includes('users') && <NavLink to='/utilities/users'>Users<i className="fa-solid fa-user-gear" /></NavLink>}
                                {state.admin.role.includes('admins') && <NavLink to='/utilities/admins'>Admins<i className="fa-solid fa-user-tie" /></NavLink>}
                            </div>
                        </div>
                    }
                    <div className='parent-cont'>
                        <NavLink onClick={() => handleOpenNav('help')} to='/help'>Help<i className="fa-regular fa-circle-question" /></NavLink>
                        <div className={`child-cont ${openNav === 'help' ? 'open' : ''}`}>
                            <NavLink to='/help/user-manual'>User Manual<i className="fa-solid fa-circle-info" /></NavLink>
                        </div>
                    </div>
                </div>
                <div className="content-cont">
                    {openSettings &&
                        <div ref={settingsRef} className='settings-cont'>
                            <button className='logout' onClick={handleLogout}>Logout<i className="fa-solid fa-right-from-bracket" /></button>
                        </div>
                    }
                    <Outlet />
                </div>
            </div>
        </div >

    )
}
