import axios from "axios"
import { useEffect, useState } from "react"
import Loader from "./Loader"
import { format, formatDistance } from "date-fns"
import useAdmin from "../hooks/useAdmin"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"



const Completed = () => {
    const { state } = useAdmin()
    const [isLoading, setIsLoading] = useState(true)
    const [books, setBooks] = useState([])

    const [star, setStar] = useState(0)
    const [feedback, setFeedback] = useState("")
    const [anonymous, setAnonymous] = useState(false)
    const [toRateId, setToRateId] = useState("")

    useEffect(() => {
        fetchConfirmed()
    }, [])

    const fetchConfirmed = async () => {
        axios.get("book/user", { params: { status: "completed", email: state.user.email } })
            .then(res => setBooks(res.data))
            .finally(() => setIsLoading(false))
    }

    const handleCloseRating = () => {
        setStar(0)
        setFeedback("")
        setAnonymous(false)
        setToRateId("")
    }
    const handleOpenRating = (_id) => {
        setToRateId(_id)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        axios.post("/feedback/create", { email: state.user.email, star, feedback, anonymous, bookId: toRateId })
        handleCloseRating()
        setIsLoading(true)
        fetchConfirmed()
    }

    return (
        <div className="completed book-wrapper">
            {isLoading ?
                <Loader />
                :
                <>
                    {books.map(book => (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: 1, amount: 0.3 }}
                            className="book"
                            key={book._id}
                        >
                            <div className="date">
                                <h1>{format(book.from, 'LLLL d' + (new Date(book.from).getFullYear() === new Date(book.to).getFullYear() ? '' : ', yyyy'))} - {format(book.to, (new Date(book.from).getMonth() === new Date(book.to).getMonth() ? '' : 'LLL ') + 'd, yyyy')}</h1>
                                <h2>({`${Math.ceil((new Date(book.to) - new Date(book.from)) / (1000 * 60 * 60 * 24))} ${Math.ceil((new Date(book.to) - new Date(book.from)) / (1000 * 60 * 60 * 24)) === 1 ? "night" : "nights"}`})</h2>
                            </div>
                            <hr />
                            <div className="rooms">
                                {book.room.map(room => (
                                    <div className="room-wrapper" key={room._id}>
                                        <div key={room._id} className="room">
                                            <h1>{room.roomType}</h1>
                                            <h2>₱{room.rate.toLocaleString()}</h2>
                                        </div>
                                        <div className="added-person">
                                            <h1>{Array.from({ length: room.maxPerson }, (_, i) => <i className={"fa-solid fa-person" + (i % 2 !== 0 ? "-dress" : "")} key={i} />)}{room.addedPerson !== 0 && " + "}{Array.from({ length: room.addedPerson }, (_, i) => <i className={"fa-solid fa-person" + (i % 2 !== 0 ? "-dress" : "")} key={i} />)} ({room.addedPerson + room.maxPerson})</h1>
                                            {room.addedPerson !== 0 && <h2>({room.addedPerson} x {room.addedPersonRate.toLocaleString()}) ₱{(room.addedPerson * room.addedPersonRate).toLocaleString()}</h2>}
                                        </div>
                                    </div>
                                ))}
                                <hr />
                                {book.addCharges.length > 0 &&
                                    <>
                                        <div className="room-wrapper">
                                            {book.addCharges.map(charge => (
                                                <div key={charge._id} className="room">
                                                    <h1>{charge.charge}</h1>
                                                    <h2>₱{charge.amount.toLocaleString()}</h2>
                                                </div>
                                            ))}
                                        </div>
                                        <hr />
                                    </>
                                }
                                <div className="total-wrapper">
                                    {Math.ceil((new Date(book.to) - new Date(book.from)) / (1000 * 60 * 60 * 24)) > 1 ?
                                        <>
                                            <div className="total">
                                                <h1>Total per day:</h1>
                                                <h2>₱{book.room.reduce((acc, curr) => acc + (curr.rate + (curr.addedPerson * curr.addedPersonRate)), 0).toLocaleString()}</h2>
                                            </div>
                                            <div className="total">
                                                <h1>Final total:</h1>
                                                <h2>({formatDistance(book.from, book.to)} x {book.room.reduce((acc, curr) => acc + (curr.rate + (curr.addedPerson * curr.addedPersonRate)), 0).toLocaleString()}) ₱{book.total.toLocaleString()}</h2>
                                            </div>
                                        </>
                                        :
                                        <div className="total">
                                            <h1>Total:</h1>
                                            <h2>₱{book.total.toLocaleString()}</h2>
                                        </div>
                                    }
                                </div>
                                <hr />
                                {book.feedback &&
                                    <div className="feedback">
                                        <h1>Your Feedback:</h1>
                                        <div className="rating">
                                            <i className="fa-solid fa-star" style={{ color: book.feedback.star >= 1 ? "var(--gold)" : "" }} />
                                            <i className="fa-solid fa-star" style={{ color: book.feedback.star >= 2 ? "var(--gold)" : "" }} />
                                            <i className="fa-solid fa-star" style={{ color: book.feedback.star >= 3 ? "var(--gold)" : "" }} />
                                            <i className="fa-solid fa-star" style={{ color: book.feedback.star >= 4 ? "var(--gold)" : "" }} />
                                            <i className="fa-solid fa-star" style={{ color: book.feedback.star >= 5 ? "var(--gold)" : "" }} />
                                        </div>
                                        <textarea disabled value={book.feedback.feedback}></textarea>
                                    </div>
                                }
                                {(toRateId !== book._id && !book.feedback) &&
                                    <button onClick={() => handleOpenRating(book._id)}>Give Feedback</button>
                                }
                                {toRateId === book._id &&
                                    <form onSubmit={handleSubmit} className="feedback">
                                        <h1>Rate your stay</h1>
                                        <div className="rating">
                                            <i className="fa-solid fa-star" onClick={() => setStar(1)} style={{ color: star >= 1 ? "var(--gold)" : "" }} />
                                            <i className="fa-solid fa-star" onClick={() => setStar(2)} style={{ color: star >= 2 ? "var(--gold)" : "" }} />
                                            <i className="fa-solid fa-star" onClick={() => setStar(3)} style={{ color: star >= 3 ? "var(--gold)" : "" }} />
                                            <i className="fa-solid fa-star" onClick={() => setStar(4)} style={{ color: star >= 4 ? "var(--gold)" : "" }} />
                                            <i className="fa-solid fa-star" onClick={() => setStar(5)} style={{ color: star >= 5 ? "var(--gold)" : "" }} />
                                        </div>
                                        <textarea rows={3} placeholder="Leave a feedback..." value={feedback} onChange={(e) => setFeedback(e.target.value)}></textarea>
                                        <div className="anonymous">
                                            <input type="checkbox" checked={anonymous} onChange={(e) => setAnonymous(e.target.checked)} /> Leave feedback anonymously
                                        </div>
                                        <div className="bttns">
                                            <button type="button" className="red" onClick={handleCloseRating}>Cancel</button>
                                            {star > 0 && <button type="submit">Submit</button>}
                                        </div>
                                    </form>
                                }
                            </div>
                        </motion.div>
                    ))}
                    {books.length === 0 &&
                        <motion.div
                            initial={{ opacity: 0.5, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3 }}
                            className="book"
                        >
                            <h3>No completed bookings</h3>
                            <Link to="/booking" className="book-now">Book Now</Link>
                        </motion.div>
                    }
                </>
            }
        </div>
    )
}

export default Completed