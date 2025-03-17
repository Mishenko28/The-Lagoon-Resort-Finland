import { Outlet } from "react-router-dom"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import { useEffect, useState, useRef } from "react"
import UserOptions from "../components/UserOptions"
import useAdmin from "../hooks/useAdmin"

const RootLayout = () => {
    const { state } = useAdmin()
    const [userOptions, setUserOptions] = useState(false)
    const profileRef1 = useRef(null)
    const profileRef2 = useRef(null)
    const profileDropdownRef = useRef(null)

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (
                profileRef1.current &&
                !profileRef1.current.contains(e.target) &&
                profileRef2.current &&
                !profileRef2.current.contains(e.target) &&
                profileDropdownRef.current &&
                !profileDropdownRef.current.contains(e.target)
            ) {
                setUserOptions(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)

        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [profileRef1, profileRef1, profileDropdownRef])

    useEffect(() => {
        !state.user && setUserOptions(false)
    }, [state])

    return (
        <>
            <div className="app">
                <Navbar profileRef1={profileRef1} profileRef2={profileRef2} setUserOptions={setUserOptions} />
                <div className="content">
                    {userOptions && <UserOptions setUserOptions={setUserOptions} profileDropdownRef={profileDropdownRef} />}
                    <Outlet />
                </div>
            </div>
            <Footer />
        </>
    )
}

export default RootLayout