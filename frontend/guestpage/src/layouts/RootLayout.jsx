import { Outlet } from "react-router-dom"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import { useEffect, useState, useRef } from "react"
import UserOptions from "../components/UserOptions"
import useAdmin from "../hooks/useAdmin"



const RootLayout = () => {
    const { state } = useAdmin()
    const [userOptions, setUserOptions] = useState(false)
    const profileRef = useRef(null)
    const profileDropdownRef = useRef(null)

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (profileRef.current && !profileRef.current.contains(e.target) && profileDropdownRef.current && !profileDropdownRef.current.contains(e.target)) {
                setUserOptions(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)

        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    })



    useEffect(() => {
        !state.user && setUserOptions(false)
    }, [state])

    return (
        <>
            <div className="app">
                <Navbar profileRef={profileRef} setUserOptions={setUserOptions} />
                <div className="content">
                    {userOptions && <UserOptions profileDropdownRef={profileDropdownRef} />}
                    <Outlet />
                </div>
                <img className="background" src="/bg2.avif" />
            </div>
            <Footer />
        </>
    )
}

export default RootLayout