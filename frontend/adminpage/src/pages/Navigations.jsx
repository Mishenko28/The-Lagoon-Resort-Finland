import '../styles/navigations.css'
import { NavLink, Outlet, useLocation } from "react-router-dom"
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
        setOpenNav(path)


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
                <div className='profile-cont'>
                    <img src="https://www.w3schools.com/howto/img_avatar.png" alt="profile-pic" />
                    <h3>{state.admin.email}</h3>
                </div>
                <i ref={settingsBtnRef} onClick={() => setOpenSettings(!openSettings)} className="fa-solid fa-ellipsis-vertical" />
            </div >
            <div className='nav-and-con'>
                <div className="navigation-cont">
                    <div className='parent-cont'>
                        <NavLink onClick={() => handleOpenNav('dashboard')} to='/dashboard'>Dashboard<i className="fa-solid fa-chart-simple" /></NavLink>
                        <div className={`child-cont ${openNav === 'dashboard' ? 'open' : ''}`}>
                            <NavLink to='/dashboard/booking'>Bookings<i className="fa-solid fa-book-bookmark" /></NavLink>
                            <NavLink to='/dashboard/report'>Reports<i className="fa-solid fa-chart-line" /></NavLink>
                        </div>
                    </div>
                    <div className='parent-cont'>
                        <NavLink onClick={() => handleOpenNav('configuration')} to='/configuration'>Configuration<i className="fa-solid fa-wrench" /></NavLink>
                        <div className={`child-cont ${openNav === 'configuration' ? 'open' : ''}`}>
                            <NavLink to='/configuration/room'>Rooms<i className="fa-solid fa-building" /></NavLink>
                            <NavLink to='/configuration/amenity'>Amenities<i className="fa-solid fa-umbrella-beach" /></NavLink>
                            <NavLink to='/configuration/gallery'>Gallery<i className="fa-solid fa-camera-retro" /></NavLink>
                            <NavLink to='/configuration/about-us'>About Us<i className="fa-solid fa-location-dot" /></NavLink>
                        </div>
                    </div>
                    <div className='parent-cont'>
                        <NavLink onClick={() => handleOpenNav('utilities')} to='/utilities'>Utilities<i className="fa-solid fa-server" /></NavLink>
                        <div className={`child-cont ${openNav === 'utilities' ? 'open' : ''}`}>
                            <NavLink to='/utilities/archive'>Archive<i className="fa-solid fa-recycle" /></NavLink>
                            <NavLink to='/utilities/activity-logs'>Activity Logs<i className="fa-solid fa-folder-closed" /></NavLink>
                            <NavLink to='/utilities/database'>Database<i className="fa-solid fa-database" /></NavLink>
                            <NavLink to='/utilities/users'>Users<i className="fa-solid fa-user-gear" /></NavLink>
                            <NavLink to='/utilities/admins'>Admins<i className="fa-solid fa-user-tie" /></NavLink>
                        </div>
                    </div>
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
