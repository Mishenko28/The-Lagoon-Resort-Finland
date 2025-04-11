import { useEffect, useRef, useState } from "react"
import useAdmin from "../../hooks/useAdmin"
import Loader2 from "../../components/Loader2"
import axios from "axios"
import { format } from 'date-fns'
import useConvertBase64 from "../../hooks/useConvertBase64"
import { motion, AnimatePresence } from "framer-motion"
import { useSearchParams, useNavigate } from "react-router-dom"


const Users = () => {
    const search = useSearchParams()[0].get('search') || ""
    const navigate = useNavigate()

    const [base64, convertToBase64] = useConvertBase64("/profile.webp")
    const { dispatch } = useAdmin()
    const [isLoading, setIsLoading] = useState(true)
    const [searching, setSearching] = useState(false)

    const [users, setUsers] = useState([])
    const [totalUsers, setTotalUsers] = useState(0)
    const [page, setPage] = useState(1)

    const [newUserTogg, setNewUserTogg] = useState(false)
    const [newUser, setNewUser] = useState({
        email: "",
        password: "",
        name: "",
        age: "",
        sex: "",
        contact: "",
        img: base64
    })
    const [confirmPass, setConfirmPass] = useState("")
    const [addUserLoading, setAddUserLoading] = useState(false)

    useEffect(() => {
        setNewUser(prev => ({ ...prev, img: base64 }))
    }, [base64])

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
            })
            .finally(() => {
                setIsLoading(false)
                setSearching(false)
            })
    }

    const handleCloseAddUser = () => {
        setNewUserTogg(false)
        setNewUser({
            email: "",
            password: "",
            name: "",
            age: "",
            sex: "",
            contact: "",
            img: "/profile.webp"
        })
    }

    const handleAddUserSubmit = (e) => {
        e.preventDefault()

        if (newUser.password !== confirmPass) {
            dispatch({ type: 'FAILED', payload: "passwords do not match" })
            return
        }

        if (!newUser.email || !newUser.password || !newUser.name || !newUser.age || !newUser.sex || !newUser.contact) {
            dispatch({ type: 'FAILED', payload: "please fill all fields" })
            return
        }

        setAddUserLoading(true)

        axios.post("/user/add", newUser)
            .then(res => {
                setUsers(prev => [...prev, res.data])
                setTotalUsers(prev => prev + 1)
                handleCloseAddUser()
            })
            .catch(err => {
                dispatch({ type: 'FAILED', payload: err.response.data.error })
            })
            .finally(() => setAddUserLoading(false))
    }

    return (
        <div className="users">
            {isLoading ?
                <Loader2 />
                :
                <>
                    <div className="header">
                        <input className="search" value={search} onChange={e => navigate(`?search=${e.target.value}`)} type="text" placeholder="Search Email" />
                        <div className="page-wrapper">
                            <button onClick={() => setPage(prev => Math.max(1, prev - 1))} className="prev"><i className="fa-solid fa-caret-left" /></button>
                            <input onBlur={() => page === "" && setPage(1)} type="number" onChange={e => setPage(e.target.value === "" ? "" : Math.min(Math.ceil(totalUsers / 30), e.target.value))} value={page} />
                            <button onClick={() => setPage(prev => Math.min(Math.ceil(totalUsers / 30), prev + 1))} className="next"><i className="fa-solid fa-caret-right" /></button>
                        </div>
                        <h1>Total Users: {totalUsers}</h1>
                        <button className="add" onClick={() => setNewUserTogg(true)}>Add User</button>
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
                                <AnimatePresence mode="sync">
                                    {users.map(user => (
                                        <motion.tr
                                            layout
                                            initial={{ opacity: 0.5 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ duration: 0.3 }}
                                            key={user._id}
                                        >
                                            <td><img src={user.personalData?.img || "/profile.webp"} /></td>
                                            <td>
                                                {user.email.split(new RegExp(`(${search})`, 'gi')).map((part, i) => (
                                                    <span key={i} style={part.toLowerCase() === search.toLowerCase() ? { backgroundColor: "var(--light-gray)" } : null}>
                                                        {part}
                                                    </span>
                                                ))}
                                            </td>
                                            <td>{user.personalData?.name}</td>
                                            <td>{user.personalData?.age}</td>
                                            <td>{user.personalData?.sex}</td>
                                            <td>{user.personalData?.contact}</td>
                                            <td>{user.totalBookings}</td>
                                            <td>{format(user.createdAt, "MMM d, yyyy h:mm a")}</td>
                                        </motion.tr>
                                    ))}
                                </AnimatePresence>
                                {(!searching && users.length === 0) && <tr><td colSpan={8} style={{ textAlign: "center" }}>No users found</td></tr>}
                                {searching && <tr><td colSpan={8} style={{ textAlign: "center" }}>searching...</td></tr>}
                            </tbody>
                        </table>
                    </div>
                    {newUserTogg &&
                        <div className="full-cont">
                            <div className="add-user-cont">
                                {addUserLoading && <div className="loader-line"></div>}
                                <i className="fa-solid fa-xmark" onClick={handleCloseAddUser} />
                                <h1>Add User</h1>
                                <form onSubmit={handleAddUserSubmit}>
                                    <input type="email" placeholder="email" value={newUser.email} onChange={e => setNewUser(prev => ({ ...prev, email: e.target.value }))} />
                                    <input type="password" placeholder="password" value={newUser.password} onChange={e => setNewUser(prev => ({ ...prev, password: e.target.value }))} />
                                    <input type="password" placeholder="confirm password" value={confirmPass} onChange={e => setConfirmPass(e.target.value)} />
                                    <img src={newUser.img} />
                                    <input onChange={(e) => convertToBase64(e.target.files[0])} accept=".png, .jpeg, .jpg" type="file" />
                                    <input type="text" placeholder="name" value={newUser.name} onChange={e => setNewUser(prev => ({ ...prev, name: e.target.value }))} />
                                    <input type="number" placeholder="age" value={newUser.age} onChange={e => setNewUser(prev => ({ ...prev, age: e.target.value }))} />
                                    <select value={newUser.sex} onChange={e => setNewUser(prev => ({ ...prev, sex: e.target.value }))}>
                                        <option value="">--select--</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                    </select>
                                    <input type="number" placeholder="contact number" value={newUser.contact} onChange={e => setNewUser(prev => ({ ...prev, contact: e.target.value }))} />
                                    <div className="bttns">
                                        <button disabled={addUserLoading} type="submit">Confirm</button>
                                        <button type="button">Cancel</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    }
                </>
            }
        </div>
    )
}

export default Users