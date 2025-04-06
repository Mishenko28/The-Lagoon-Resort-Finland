import { useEffect, useRef, useState } from "react"
import useAdmin from "../../hooks/useAdmin"
import Loader2 from "../../components/Loader2"
import axios from "axios"
import { format } from 'date-fns'


const Users = () => {
    const { dispatch } = useAdmin()
    const [isLoading, setIsLoading] = useState(true)
    const [searching, setSearching] = useState(false)

    const [users, setUsers] = useState([])
    const [totalUsers, setTotalUsers] = useState(0)
    const [search, setSearch] = useState("")
    const [page, setPage] = useState(1)

    useEffect(() => {
        fetchUsers()
        setUsers(prev => prev.filter(user => new RegExp(`(${search})`, 'gi').test(user.email)))
    }, [page, search])

    const fetchUsers = async () => {
        setSearching(true)

        axios.get(`/user/all`, { params: { page: page || 1, search } })
            .then(res => {
                setUsers(res.data.users.filter(user => new RegExp(`(${search})`, 'gi').test(user.email)))
                setTotalUsers(res.data.totalUsers)
            })
            .catch((err) => {
                dispatch({ type: 'FAILED', payload: err.response.data.error })
                console.log(err.response.data.error)
            })
            .finally(() => {
                setIsLoading(false)
                setSearching(false)
            })
    }

    return (
        <div className="users">
            {isLoading ?
                <Loader2 />
                :
                <>
                    <div className="header">
                        <input className="search" value={search} onChange={e => setSearch(e.target.value)} type="text" placeholder="Search" />
                        <div className="page-wrapper">
                            <button onClick={() => setPage(prev => Math.max(1, prev - 1))} className="prev-btn">Prev</button>
                            <input onBlur={() => page === "" && setPage(1)} type="number" onChange={e => setPage(e.target.value === "" ? "" : Math.min(Math.ceil(totalUsers / 30), e.target.value))} value={page} />
                            <button onClick={() => setPage(prev => Math.min(Math.ceil(totalUsers / 30), prev + 1))} className="next-btn">Next</button>
                        </div>
                        <h1>Total Users: {totalUsers}</h1>
                    </div>
                    <div className="table-cont">
                        <table>
                            <thead>
                                <tr>
                                    <th>Profile</th>
                                    <th>Email</th>
                                    <th>Name</th>
                                    <th>Age</th>
                                    <th>Sex</th>
                                    <th>Contact</th>
                                    <th>Total Bookings</th>
                                    <th>Created At</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(user => (
                                    <tr key={user._id}>
                                        <td><img src={user.personalData.img} /></td>
                                        <td>
                                            {user.email.split(new RegExp(`(${search})`, 'gi')).map((part, i) => (
                                                <span key={i} style={part.toLowerCase() === search.toLowerCase() ? { backgroundColor: "var(--primary)", color: "#fff" } : null}>
                                                    {part}
                                                </span>
                                            ))}
                                        </td>
                                        <td>{user.personalData.name}</td>
                                        <td>{user.personalData.age}</td>
                                        <td>{user.personalData.sex}</td>
                                        <td>{user.personalData.contact}</td>
                                        <td>{user.personalData.totalBookings}</td>
                                        <td>{format(user.createdAt, "MMM d, yyyy h:mm a")}</td>
                                    </tr>
                                ))}
                                {(!searching && users.length === 0) && <tr><td colSpan={8} style={{ textAlign: "center" }}>No users found</td></tr>}
                                {searching && <tr><td colSpan={8} style={{ textAlign: "center" }}>searching...</td></tr>}
                            </tbody>
                        </table>
                    </div>
                </>
            }
        </div>
    )
}

export default Users