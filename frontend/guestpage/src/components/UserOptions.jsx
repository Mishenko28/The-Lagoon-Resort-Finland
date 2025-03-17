import { useNavigate } from "react-router-dom"
import useAdmin from "../hooks/useAdmin"




const UserOptions = ({ setUserOptions, profileDropdownRef }) => {
    const { state, dispatch } = useAdmin()
    const navigate = useNavigate()

    const logout = () => {
        dispatch({ type: "LOGOUT" })
    }

    const handleMyProfile = () => {
        navigate("/profile")
        setUserOptions(false)
    }

    const handleMyBookings = () => {
        navigate("/my-bookings")
        setUserOptions(false)
    }

    return (
        <div ref={profileDropdownRef} className="user-options">
            <h1>{state.user?.email}</h1>
            <hr />
            <button onClick={handleMyProfile}><i className="fa-solid fa-user" />My Profile</button>
            <button onClick={handleMyBookings}><i className="fa-solid fa-book" />My Bookings</button>
            <button onClick={logout}><i className="fa-solid fa-arrow-right-from-bracket" />Logout</button>
        </div>
    )
}

export default UserOptions