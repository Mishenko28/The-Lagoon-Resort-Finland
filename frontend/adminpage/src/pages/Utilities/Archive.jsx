import { useEffect, useState } from "react"
import Loader2 from "../../components/Loader2"
import useAdmin from "../../hooks/useAdmin"
import axios from "axios"
import { format } from 'date-fns'
import { motion, AnimatePresence } from "framer-motion"

const colors = {
    room: "linear-gradient(20deg, #641e16, #b03a2e)",
    roomtype: "linear-gradient(20deg, #512e5f, #6c3483)",
    amenity: "linear-gradient(20deg, #154360, #2874a6)",
    picture: "linear-gradient(20deg, #0e6251, #117a65)",
    admin: "linear-gradient(20deg, #145a32, #239b56)",
    number: "linear-gradient(20deg, #7d6608, #b9770e)",
    social: "linear-gradient(20deg, #784212, #a04000)",
    email: "linear-gradient(20deg, #002761, #0046b0)",
}


const Archive = () => {
    const { dispatch } = useAdmin()
    const [isLoading, setIsLoading] = useState(true)

    const [toRestore, setToRestore] = useState(null)
    const [isRestoring, setIsRestoring] = useState(false)

    const [archive, setArchive] = useState([])

    const [filter, setFilter] = useState("all")

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        axios.get("archive/all")
            .then(res => setArchive(res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))))
            .catch((err) => {
                dispatch({ type: 'FAILED', payload: err.response.data.error })
            })
            .finally(() => setIsLoading(false))
    }

    const handleRestore = async (item) => {
        setIsRestoring(true)
        axios.post("archive/restore", { _id: item._id })
            .then(res => {
                dispatch({ type: 'SUCCESS', payload: true })
                setArchive(prev => prev.filter(item => !res.data.some(item2 => item._id === item2._id)))
                setToRestore(null)
            })
            .catch((err) => {
                dispatch({ type: 'FAILED', payload: err.response.data.error })
            })
            .finally(() => setIsRestoring(false))
    }

    return (
        <div className="archive">
            {isLoading ?
                <Loader2 />
                :
                <>
                    <div className="header">
                        <h1>Archive<i className="fa-solid fa-box-open" /></h1>
                        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                            <option value="all">all</option>
                            <option value="social">social</option>
                            <option value="email">email</option>
                            <option value="number">number</option>
                            <option value="roomtype">roomtype</option>
                            <option value="room">room</option>
                            <option value="picture">picture</option>
                            <option value="amenity">amenity</option>
                            <option value="admin">admin</option>
                        </select>
                    </div>
                    <div className="table-cont">
                        <table>
                            <thead>
                                <tr>
                                    <th>No.</th>
                                    <th>Type</th>
                                    <th>Value</th>
                                    <th>Date</th>
                                    <th>Deleted by</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                <AnimatePresence mode="sync">
                                    {archive.filter(item => item.type === filter || filter === "all").map((item, i) => (
                                        <motion.tr
                                            layout
                                            initial={{ opacity: 0.5 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ duration: 0.3 }}
                                            key={item._id}
                                        >
                                            <td>{i + 1}</td>
                                            <td><p style={{ background: colors[item.type] }}>{item.type}</p></td>
                                            <td>{item.value}</td>
                                            <td>{format(item.createdAt, 'PP - h:mm a')}</td>
                                            <td>{item.name}</td>
                                            <td>
                                                <button onClick={() => setToRestore(item)}>Restore</button>
                                            </td>
                                        </motion.tr>
                                    ))}
                                    {archive.length === 0 &&
                                        <motion.tr
                                            layout
                                            initial={{ opacity: 0.5 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ duration: 0.3 }}
                                            key="empty"
                                        >
                                            <td colSpan={6} style={{ textAlign: "center" }}>
                                                <h1>No items in archive</h1>
                                            </td>
                                        </motion.tr>
                                    }
                                </AnimatePresence>
                            </tbody>
                        </table>
                    </div>
                    {toRestore &&
                        <div className="full-cont">
                            <div className="confirm-restore">
                                {isRestoring && <div className="loader-line"></div>}
                                <h1>Confirm Restore?</h1>
                                <p>you are about to restore this {toRestore.type}:</p>
                                <h2 style={{ background: colors[toRestore.type] }}>{toRestore.value}</h2>
                                <div className="bttns">
                                    <button disabled={isRestoring} onClick={() => handleRestore(toRestore)}>Confirm</button>
                                    <button onClick={() => setToRestore(null)}>Cancel</button>
                                </div>
                            </div>
                        </div>
                    }
                </>
            }
        </div>
    )
}

export default Archive
