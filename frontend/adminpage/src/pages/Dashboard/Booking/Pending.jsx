import { useEffect, useState } from "react"
import axios from "axios"
import { format, formatDistanceToNow } from "date-fns"
import ConfirmBook from "../../../components/ConfirmBook"
import Loader2 from "../../../components/Loader2"
import { motion, AnimatePresence } from "framer-motion"
import CancelBook from "../../../components/CancelBook"
import Note from "../../../components/Note"
import { socket } from "../../../socket"
import useAdmin from "../../../hooks/useAdmin"
import { useNavigate } from "react-router-dom"


export default function Pending({ fetchTotals, convertToNight }) {
    const { dispatch } = useAdmin()
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(true)

    const [books, setBooks] = useState([])
    const [toConfirm, setToConfirm] = useState(null)
    const [toCancel, setToCancel] = useState(null)

    const [openedNote, setOpenedNote] = useState("")

    const [searchInput, setSearchInput] = useState("")


    useEffect(() => {
        fetchBooks()
        fetchTotals()
        socket.connect()

        const handleNewBooking = (data) => {
            setBooks(prev => [...prev, data])
            fetchTotals()
        }
        const handleCancelBooking = (data) => {
            setBooks(prev => prev.filter(book => book._id !== data._id))
            fetchTotals()
        }

        socket.on('new-booking', handleNewBooking)
        socket.on('cancel-booking', handleCancelBooking)

        return () => {
            socket.off('new-booking', handleNewBooking)
            socket.off('cancel-booking', handleCancelBooking)
            socket.disconnect()
        }

    }, [])

    const fetchBooks = async () => {
        axios.get("book/pending")
            .then(res => setBooks(res.data))
            .catch((err) => {
                dispatch({ type: 'FAILED', payload: err.response.data.error })
            })
            .finally(() => setIsLoading(false))
    }

    if (isLoading) return <Loader2 />

    return (
        <>
            <div className="book-header">
                <input className="search" value={searchInput} onChange={e => !(searchInput.length === 0 && e.target.value === " ") && setSearchInput(e.target.value)} type="text" placeholder="search for email or guest name" />
                <h1>Total Submissions: {books.length}</h1>
                <h1>Total Rooms to reserve: {books.reduce((total, currentBook) => currentBook.room.length + total, 0)}</h1>
                <h1>Total Down payments: ₱{books.reduce((total, currentBook) => currentBook.deposit + total, 0)}</h1>
                <h1>Sum Total: ₱{books.reduce((total, currentBook) => currentBook.total + total, 0)}</h1>
            </div>
            <div className="book">
                <table>
                    <thead>
                        <tr>
                            <th>No.</th>
                            <th>Email</th>
                            <th>Guest</th>
                            <th>Contact Number</th>
                            <th>Timeframe</th>
                            <th>Room Type</th>
                            <th>Note</th>
                            <th>Down Payment</th>
                            <th>Total</th>
                            <th>Submitted since</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <AnimatePresence mode="sync">
                            {books.filter(book => new RegExp(searchInput, 'i').test(book.user.email) || new RegExp(searchInput, 'i').test(book.user.name)).map((book, i) => (
                                <motion.tr
                                    layout
                                    initial={{ opacity: 0.5 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    key={book._id}
                                    onClick={() => navigate(`/utilities/users?search=${book.user.email}`)}
                                >
                                    <td>{i + 1}</td>
                                    <td>
                                        {book.user.email.split(new RegExp(`(${searchInput})`, 'gi')).map((part, i) => (
                                            <span key={i} style={part.toLowerCase() === searchInput.toLowerCase() ? { backgroundColor: "var(--light-gray)" } : null}>
                                                {part}
                                            </span>
                                        ))}
                                    </td>
                                    <td>
                                        {book.user.name.split(new RegExp(`(${searchInput})`, 'gi')).map((part, i) => (
                                            <span key={i} style={part.toLowerCase() === searchInput.toLowerCase() ? { backgroundColor: "var(--light-gray)" } : null}>
                                                {part}
                                            </span>
                                        ))}
                                        <br />
                                        {book.user.sex}, {book.user.age}yrs old
                                    </td>
                                    <td>{book.user.contact}</td>
                                    <td>
                                        {format(book.from, 'LLL d' + (new Date(book.from).getFullYear() === new Date(book.to).getFullYear() ? '' : ', yyyy'))} - {format(book.to, (new Date(book.from).getMonth() === new Date(book.to).getMonth() ? '' : 'LLL ') + 'd, yyyy')}
                                        <br />
                                        {convertToNight(book.from, book.to)}
                                    </td>
                                    <td>
                                        {book.room.map((room, i) => (
                                            <div key={i}>
                                                {room.roomType}
                                                {room.addedPerson > 0 &&
                                                    <span>(+{room.addedPerson} < i className="fa-solid fa-person" />)</span>
                                                }
                                            </div>
                                        ))}
                                    </td>
                                    <td>{book.note && <i onClick={() => setOpenedNote(book.note)} className="fa-solid fa-envelope" />}</td>
                                    <td>₱{book.deposit.toLocaleString()}</td>
                                    <td>₱{book.total.toLocaleString()}</td>
                                    <td>{formatDistanceToNow(book.createdAt, { addSuffix: 1 })}</td>
                                    <td>
                                        <div className="bttns">
                                            <button onClick={e => { e.stopPropagation(), setToConfirm(book) }} className="submit">Confirm</button>
                                            <button onClick={e => { e.stopPropagation(), setToCancel(book) }} className="delete">Cancel</button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </AnimatePresence>
                        {books.length === 0 && (
                            <tr>
                                <td colSpan="11" className="center">No bookings.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
                {toCancel && <CancelBook fetchTotals={fetchTotals} convertToNight={convertToNight} setBooks={setBooks} setToCancel={setToCancel} toCancel={toCancel} />}
                {toConfirm && <ConfirmBook fetchTotals={fetchTotals} convertToNight={convertToNight} setBooks={setBooks} setToConfirm={setToConfirm} toConfirm={toConfirm} />}
                {openedNote && <Note openedNote={openedNote} setOpenedNote={setOpenedNote} />}
            </div >
        </>
    )
}
