import { useEffect, useState } from "react"
import axios from "axios"
import { format, isPast } from "date-fns"
import Loader2 from "../../../components/Loader2"
import { motion, AnimatePresence } from "framer-motion"
import Note from "../../../components/Note"
import DatePicker from "react-datepicker"

const Cancelled = ({ convertToNight }) => {
    const [isLoading, setIsLoading] = useState(true)

    const [books, setBooks] = useState([])

    const [openedNote, setOpenedNote] = useState("")

    const [searchInput, setSearchInput] = useState("")

    const [month, setMonth] = useState(new Date())

    useEffect(() => {
        fetchBooks()
    }, [month])

    const fetchBooks = async () => {
        axios.get("book/cancelled", { params: { month } })
            .then(res => {
                const books = res.data.sort((a, b) => a.to < b.to ? -1 : 1)

                setBooks(books)
            })
            .finally(() => setIsLoading(false))
    }

    if (isLoading) return <Loader2 />

    return (
        <>
            <div className="book-header">
                <input className="search" value={searchInput} onChange={e => !(searchInput.length === 0 && e.target.value === " ") && setSearchInput(e.target.value)} type="text" placeholder="search for email or guest name" />
                <h1>Total: {books.length}</h1>
                <DatePicker
                    className="month-date-picker"
                    selected={month}
                    onChange={date => setMonth(date)}
                    maxDate={new Date()}
                    dateFormat="MMMM - yyyy"
                    showMonthYearPicker
                    showFullMonthYearPicker
                />
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
                                >
                                    <td>{i + 1}</td>
                                    <td>
                                        {book.user.email.split(new RegExp(`(${searchInput})`, 'gi')).map((part, i) => (
                                            <span key={i} style={part.toLowerCase() === searchInput.toLowerCase() ? { backgroundColor: "var(--primary)", color: "#fff" } : null}>
                                                {part}
                                            </span>
                                        ))}
                                    </td>
                                    <td>
                                        {book.user.name.split(new RegExp(`(${searchInput})`, 'gi')).map((part, i) => (
                                            <span key={i} style={part.toLowerCase() === searchInput.toLowerCase() ? { backgroundColor: "var(--primary)", color: "#fff" } : null}>
                                                {part}
                                            </span>
                                        ))}
                                        <br />
                                        {book.user.sex}, {book.user.age}yrs old
                                    </td>
                                    <td>{book.user.contact}</td>
                                    <td>
                                        {isPast(book.to) && <p>time reached</p>}
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
                                    <td>₱{book.deposit}</td>
                                    <td>₱{book.total}</td>
                                    <td>₱{book.payed}</td>
                                    <td>₱{book.balance}</td>
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
                {openedNote && <Note openedNote={openedNote} setOpenedNote={setOpenedNote} />}
            </div>
        </>
    )
}

export default Cancelled