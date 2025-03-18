import axios from "axios"
import { useEffect, useState } from "react"
import Loader from "./Loader"
import { format, formatDistance } from "date-fns"
import useAdmin from "../hooks/useAdmin"
import { Link } from "react-router-dom"




const Cancelled = () => {
    const { state } = useAdmin()
    const [isLoading, setIsLoading] = useState(true)
    const [books, setBooks] = useState([])

    useEffect(() => {
        fetchPending()
    }, [])

    const fetchPending = async () => {
        axios.get("book/user", { params: { status: "cancelled", email: state.user.email } })
            .then(res => setBooks(res.data))
            .finally(() => setIsLoading(false))
    }

    return (
        <div className="cancelled book-wrapper">
            {isLoading ?
                <Loader />
                :
                <>
                    {books.map(book => (
                        <div className="book" key={book._id}>
                            <div className="date">
                                <h1>{format(book.from, 'LLLL d' + (new Date(book.from).getFullYear() === new Date(book.to).getFullYear() ? '' : ', yyyy'))} - {format(book.to, (new Date(book.from).getMonth() === new Date(book.to).getMonth() ? '' : 'LLL ') + 'd, yyyy')}</h1>
                                <h2>({formatDistance(book.from, book.to)})</h2>
                            </div>
                            <hr />
                            <div className="rooms">
                                {book.room.map(room => (
                                    <div className="room-wrapper" key={room._id}>
                                        <div key={room._id} className="room">
                                            <h1>{room.roomType}</h1>
                                            <h2>₱{room.rate}</h2>
                                        </div>
                                        <div className="added-person">
                                            <h1>{Array.from({ length: room.maxPerson }, (_, i) => <i className={"fa-solid fa-person" + (i % 2 !== 0 ? "-dress" : "")} key={i} />)}{room.addedPerson !== 0 && " + "}{Array.from({ length: room.addedPerson }, (_, i) => <i className={"fa-solid fa-person" + (i % 2 !== 0 ? "-dress" : "")} key={i} />)} ({room.addedPerson + room.maxPerson})</h1>
                                            {room.addedPerson !== 0 && <h2>({room.addedPerson} x {room.addedPersonRate}) ₱{room.addedPerson * room.addedPersonRate}</h2>}
                                        </div>
                                    </div>
                                ))}
                                <hr />
                                <div className="total-wrapper">
                                    {Math.ceil((new Date(book.to) - new Date(book.from)) / (1000 * 60 * 60 * 24)) > 1 ?
                                        <>
                                            <div className="total">
                                                <h1>Total per day:</h1>
                                                <h2>₱{book.room.reduce((acc, curr) => acc + (curr.rate + (curr.addedPerson * curr.addedPersonRate)), 0)}</h2>
                                            </div>
                                            <div className="total">
                                                <h1>Final total:</h1>
                                                <h2>({formatDistance(book.from, book.to)} x {book.room.reduce((acc, curr) => acc + (curr.rate + (curr.addedPerson * curr.addedPersonRate)), 0)}) ₱{book.total}</h2>
                                            </div>
                                        </>
                                        :
                                        <div className="total">
                                            <h1>Total:</h1>
                                            <h2>₱{book.total}</h2>
                                        </div>
                                    }
                                    <div className="total">
                                        <h1>Down payment:</h1>
                                        <h2>₱{book.deposit}</h2>
                                    </div>
                                </div>
                            </div>
                            <hr />
                            {book.note &&
                                <>
                                    <div className="note">
                                        <h1>Note:</h1>
                                        <h2>{book.note}</h2>
                                    </div>
                                    <hr />
                                </>
                            }
                            <div className="cancel-reason">
                                <h1>reason:</h1>
                                <h2>{book.reasonToCancel}</h2>
                            </div>
                        </div>
                    ))}
                    {books.length === 0 &&
                        <div className="book">
                            <h3>No cancelled bookings</h3>
                            <Link to="/booking" className="book-now">Book Now</Link>
                        </div>
                    }
                </>
            }
        </div>
    )
}

export default Cancelled