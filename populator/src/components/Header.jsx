
const Header = ({ setAdmin, setPage, removeAdmin }) => {
    const logout = () => {
        setAdmin(null)
        removeAdmin()
    }

    return (
        <header>
            <h1 onClick={() => setPage("home")}>Data Populator</h1>
            <nav>
                <ul>
                    <li onClick={() => setPage("user")}>User</li>
                    <li onClick={() => setPage("booking")}>Booking</li>
                </ul>
            </nav>
            <button onClick={logout}>Logout</button>
        </header>
    )
}

export default Header