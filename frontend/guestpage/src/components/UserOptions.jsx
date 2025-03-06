import useAdmin from "../hooks/useAdmin"




const UserOptions = ({ profileDropdownRef }) => {
    const { dispatch } = useAdmin()

    const logout = () => {
        dispatch({ type: "LOGOUT" })
    }

    return (
        <div ref={profileDropdownRef} className="user-options">
            <button><i className="fa-solid fa-user" />My Profile</button>
            <button><i className="fa-solid fa-book" />My Bookings</button>
            <button onClick={logout}><i className="fa-solid fa-arrow-right-from-bracket" />Logout</button>
        </div>
    )
}

export default UserOptions