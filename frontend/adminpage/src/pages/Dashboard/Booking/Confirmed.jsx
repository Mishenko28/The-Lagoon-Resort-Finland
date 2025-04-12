import { useEffect, useState } from "react"
import axios from "axios"
import { format } from "date-fns"
import Loader2 from "../../../components/Loader2"
import { motion, AnimatePresence } from "framer-motion"
import Note from "../../../components/Note"
import CancelBook from "../../../components/CancelBook"
import ChangeBook from "../../../components/ChangeBook"
import useAdmin from "../../../hooks/useAdmin"
import { useNavigate } from "react-router-dom"



const Confirmed = ({ fetchTotals, convertToNight }) => {
    const { dispatch } = useAdmin()
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(true)

    const [books, setBooks] = useState([])

    const [toCancel, setToCancel] = useState(null)
    const [toChange, setToChange] = useState(null)

    const [openedNote, setOpenedNote] = useState("")

    const [searchInput, setSearchInput] = useState("")

    useEffect(() => {
        fetchBooks()
    }, [])

    const fetchBooks = async () => {
        axios.get("book/confirmed")
            .then(res => setBooks(res.data))
            .catch((err) => {
                dispatch({ type: 'FAILED', payload: err.response.data.error })
                    .log(err.response.data.error)
            })
            .finally(() => setIsLoading(false))
    }

    if (isLoading) return <Loader2 />

    return (
        <>
            <div className="book-header">
                <input className="search" value={searchInput} onChange={e => !(searchInput.length === 0 && e.target.value === " ") && setSearchInput(e.target.value)} type="text" placeholder="search for email or guest name" />
                <h1>Total Reservations: {books.length}</h1>
                <h1>Total Reserved Rooms: {books.reduce((total, currentBook) => currentBook.room.length + total, 0)}</h1>
                <h1>Total Amount Paid: ₱{books.reduce((total, currentBook) => currentBook.payed + total, 0)}</h1>
                <h1>Total Amount to be Paid: ₱{books.reduce((total, currentBook) => currentBook.total + total, 0)}</h1>
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
                            <th>Payed</th>
                            <th>Remaining</th>
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
                                                {room.roomType} (room {room.roomNo})
                                                {room.addedPerson > 0 &&
                                                    <span>(+{room.addedPerson} < i className="fa-solid fa-person" />)</span>
                                                }
                                            </div>
                                        ))}
                                    </td>
                                    <td>{book.note && <i onClick={() => setOpenedNote(book.note)} className="fa-solid fa-envelope" />}</td>
                                    <td>₱{book.deposit.toLocaleString()}</td>
                                    <td>₱{book.total.toLocaleString()}</td>
                                    <td>₱{book.payed.toLocaleString()}</td>
                                    <td>₱{book.balance.toLocaleString()}</td>
                                    <td>
                                        <div className="bttns">
                                            <button onClick={e => { e.stopPropagation(), setToChange(book) }} className="blue">Change</button>
                                            <button onClick={e => { e.stopPropagation(), setToCancel(book) }} className="red">Cancel</button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </AnimatePresence>
                        {books.length === 0 && (
                            <tr>
                                <td colSpan="12" className="center">No bookings.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
                {toChange && <ChangeBook fetchTotals={fetchTotals} convertToNight={convertToNight} setBooks={setBooks} setToChange={setToChange} toChange={toChange} />}
                {toCancel && <CancelBook fetchTotals={fetchTotals} convertToNight={convertToNight} setBooks={setBooks} setToCancel={setToCancel} toCancel={toCancel} />}
                {openedNote && <Note openedNote={openedNote} setOpenedNote={setOpenedNote} />}
            </div>
        </>
    )
}

export default Confirmed