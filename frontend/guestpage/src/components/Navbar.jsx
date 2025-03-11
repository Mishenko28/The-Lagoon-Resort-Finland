import { Link, NavLink } from "react-router-dom"
import BarMenu from "./BarMenu"
import { useEffect, useRef, useState } from "react"
import useAdmin from "../hooks/useAdmin"




const Navbar = ({ setUserOptions, profileRef1, profileRef2 }) => {
    const { state } = useAdmin()

    const [showDropdown, setShowDropdown] = useState(false)
    const barRef = useRef(null)
    const dropdownRef = useRef(null)

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (barRef.current && !barRef.current.contains(e.target) && dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setShowDropdown(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)

        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [])

    return (
        <header>
            <div className="navigations">
                <ul>
                    <NavLink to='accommodations' ><li>ACCOMMODATION</li></NavLink>
                    <NavLink to='amenities' ><li>AMENITY</li></NavLink>
                    <NavLink to='gallery' ><li>GALLERY</li></NavLink>
                    <NavLink to='booking' ><li>BOOKING</li></NavLink>
                    <NavLink to='about-us' ><li>ABOUT US</li></NavLink>
                </ul>
            </div>
            <div className="title">
                <Link to='/'><h1>The Lagoon Resort Finland Inc.</h1></Link>
            </div>
            <div className="login-profile">
                {state.user ?
                    <img ref={profileRef1} onClick={() => setUserOptions(prev => !prev)} className="prof-pic" src="/profile.webp" />
                    :
                    <ul>
                        <Link to='sign-up'><li>Sign Up</li></Link>
                        <Link to='login'><li>Login</li></Link>
                    </ul>
                }
            </div>
            <div className="mobile-nav">
                <BarMenu barRef={barRef} showDropdown={showDropdown} setShowDropdown={setShowDropdown} />
                <div className="mobile-login-profile">
                    {state.user ?
                        <img ref={profileRef2} onClick={() => setUserOptions(prev => !prev)} className="prof-pic" src="/profile.webp" />
                        :
                        <ul>
                            <Link to='sign-up'><li>Sign Up</li></Link>
                            <Link to='login'><li>Login</li></Link>
                        </ul>
                    }
                </div>
                <div ref={dropdownRef} onClick={() => setShowDropdown(false)} style={showDropdown ? { height: "200px" } : null} className="mobile-dropdown">
                    <NavLink to='accommodations' >ACCOMMODATION<i className="fa-solid fa-bed" /></NavLink>
                    <NavLink to='amenities' >AMENITY<i className="fa-solid fa-umbrella-beach" /></NavLink>
                    <NavLink to='gallery' >GALLERY<i className="fa-solid fa-image" /></NavLink>
                    <NavLink to='booking' >BOOKING<i className="fa-solid fa-calendar-check" /></NavLink>
                    <NavLink to='about-us' >ABOUT US<i className="fa-solid fa-map-location-dot" /></NavLink>
                </div>
            </div>
        </header >
    )
}

export default Navbar