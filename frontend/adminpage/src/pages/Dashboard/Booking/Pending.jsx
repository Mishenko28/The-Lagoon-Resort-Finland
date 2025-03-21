import { useEffect, useState } from "react"
import axios from "axios"
import { format, formatDistanceToNow, formatDistance } from "date-fns"
import ConfirmBook from "../../../components/ConfirmBook"
import Loader2 from "../../../components/Loader2"
import { motion, AnimatePresence } from "framer-motion"



export default function Pending() {
    const [isLoading, setIsLoading] = useState(true)

    const [books, setBooks] = useState([])
    const [toConfirm, setToConfirm] = useState(null)

    useEffect(() => {
        fetchBooks()
    }, [])

    const fetchBooks = async () => {
        axios.get("book/pending")
            .then(res => setBooks(res.data))
            .finally(() => setIsLoading(false))
    }

    if (isLoading) return <Loader2 />

    return (
        <div className="pending">
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
                                            {room.roomType}
                                            {room.addedPerson > 0 &&
                                                <span>(+{room.addedPerson} < i className="fa-solid fa-person" />)</span>
                                            }
                                        </div>
                                    ))}
                                </td>
                                <td>{book.note && <i className="fa-solid fa-envelope" />}</td>
                                <td>₱{book.deposit}</td>
                                <td>₱{book.total}</td>
                                <td>{formatDistanceToNow(book.createdAt, { addSuffix: 1 })}</td>
                                <td>
                                    <div className="bttns">
                                        <button onClick={() => setToConfirm(book)} className="green">Confirm</button>
                                        <button className="red">Cancel</button>
                                    </div>
                                </td>
                            </motion.tr>
                        ))}
                    </AnimatePresence>
                </tbody>
            </table>
            {toConfirm && <ConfirmBook setBooks={setBooks} setToConfirm={setToConfirm} toConfirm={toConfirm} />}
        </div>
    )
}
