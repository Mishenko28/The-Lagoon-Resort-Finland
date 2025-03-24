import { useEffect, useState } from "react"
import axios from "axios"
import { format, formatDistanceToNow, formatDistance } from "date-fns"
import Loader2 from "../../../components/Loader2"
import { motion, AnimatePresence } from "framer-motion"
import Note from "../../../components/Note"
import CancelBook from "../../../components/CancelBook"
import ChangeBook from "../../../components/ChangeBook"



const Confirmed = () => {
    const [isLoading, setIsLoading] = useState(true)

    const [books, setBooks] = useState([])

    const [toCancel, setToCancel] = useState(null)
    const [toChange, setToChange] = useState(null)

    const [openedNote, setOpenedNote] = useState("")

    useEffect(() => {
        fetchBooks()
    }, [])

    const fetchBooks = async () => {
        axios.get("book/confirmed")
            .then(res => setBooks(res.data))
            .finally(() => setIsLoading(false))
    }

    if (isLoading) return <Loader2 />

    return (
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
                        {books.map((book, i) => (
                            <motion.tr
                                layout
                                initial={{ opacity: 0.5 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                key={book._id}
                            >
                                <td>{i + 1}</td>
                                <td>{book.user.email}</td>
                                <td>
                                    {book.user.name}
                                    <br />
                                    {book.user.sex}, {book.user.age}yrs old
                                </td>
                                <td>{book.user.contact}</td>
                                <td>
                                    {format(book.from, 'LLL d' + (new Date(book.from).getFullYear() === new Date(book.to).getFullYear() ? '' : ', yyyy'))} - {format(book.to, (new Date(book.from).getMonth() === new Date(book.to).getMonth() ? '' : 'LLL ') + 'd, yyyy')}
                                    <br />
                                    {formatDistance(book.from, book.to)}
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
                                <td>₱{book.deposit}</td>
                                <td>₱{book.total}</td>
                                <td>₱{book.payed}</td>
                                <td>₱{book.balance}</td>
                                <td>
                                    <div className="bttns">
                                        <button onClick={() => setToChange(book)} className="blue">Change</button>
                                        <button onClick={() => setToCancel(book)} className="red">Cancel</button>
                                    </div>
                                </td>
                            </motion.tr>
                        ))}
                    </AnimatePresence>
                    {books.length === 0 && (
                        <tr>
                            <td colSpan="12" className="center">No confirmed bookings.</td>
                        </tr>
                    )}
                </tbody>
            </table>
            {toChange && <ChangeBook setBooks={setBooks} setToChange={setToChange} toChange={toChange} />}
            {toCancel && <CancelBook setBooks={setBooks} setToCancel={setToCancel} toCancel={toCancel} />}
            {openedNote && <Note openedNote={openedNote} setOpenedNote={setOpenedNote} />}
        </div>
    )
}

export default Confirmed