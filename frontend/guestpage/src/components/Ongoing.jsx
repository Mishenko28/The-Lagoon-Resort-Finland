import axios from "axios"
import { useEffect, useState } from "react"
import Loader from "./Loader"
import { format, formatDistance } from "date-fns"
import useAdmin from "../hooks/useAdmin"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"



const Ongoing = () => {
    const { state } = useAdmin()
    const [isLoading, setIsLoading] = useState(true)
    const [books, setBooks] = useState([])

    useEffect(() => {
        fetchConfirmed()
    }, [])

    const fetchConfirmed = async () => {
        axios.get("book/user", { params: { status: "ongoing", email: state.user.email } })
            .then(res => setBooks(res.data))
            .finally(() => setIsLoading(false))
    }

    return (
        <div className="ongoing book-wrapper">
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
                                    <div className="total">
                                        <h1>Down payment:</h1>
                                        <h2>₱{book.deposit.toLocaleString()}</h2>
                                    </div>
                                    <hr />
                                    <div className="total">
                                        <h1>Payment received:</h1>
                                        <h2>₱{book.payed.toLocaleString()}</h2>
                                    </div>
                                    <div className="total">
                                        <h1>Left to pay:</h1>
                                        <h2>₱{book.balance.toLocaleString()}</h2>
                                    </div>
                                </div>
                            </div>
                            {book.note &&
                                <>
                                    <div className="note">
                                        <hr />
                                        <h1>Note:</h1>
                                        <h2>{book.note}</h2>
                                    </div>
                                </>
                            }
                        </motion.div>
                    ))}
                    {books.length === 0 &&
                        <motion.div
                            initial={{ opacity: 0.5, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3 }}
                            className="book"
                        >
                            <h3>No ongoing bookings</h3>
                            <Link to="/booking" className="book-now">Book Now</Link>
                        </motion.div>
                    }
                </>
            }
        </div>
    )
}

export default Ongoing