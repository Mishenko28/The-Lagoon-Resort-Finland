import { useEffect, useState } from "react"
import axios from "axios"
import { format, formatDistance } from "date-fns"
import Loader from "./Loader"




const Pending = () => {
    const [isLoading, setIsLoading] = useState(true)
    const [books, setBooks] = useState([])

    useEffect(() => {
        fetchPending()
    }, [])

    const fetchPending = async () => {
        axios.get("book/pending")
            .then(res => setBooks(res.data))
            .finally(() => setIsLoading(false))
    }

    return (
        <div className="pending book-wrapper">
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
                            <button className="cancel">Cancel this reservation</button>
                        </div>
                    ))}
                </>
            }
        </div>
    )
}

export default Pending