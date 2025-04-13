import axios from "axios";
import { useEffect, useState } from "react";
import useAdmin from "../hooks/useAdmin";
import { format } from "date-fns";
import Loader2 from "./Loader2";

const status = [
    "pending",
    "confirmed",
    "ongoing",
    "cancelled",
    "noshow",
    "expired",
    "completed"
]

const UserDetails = ({ props: { userToShow, setUserToShow } }) => {
    const { dispatch } = useAdmin()
    const [isLoading, setIsLoading] = useState(true)
    const [books, setBookings] = useState([])

    useEffect(() => {
        fetchBookings()
    }, [])

    const fetchBookings = async () => {
        await axios.get("book/user", { params: { status: "all", email: userToShow.email } })
            .then(res => setBookings(res.data))
            .catch(error => dispatch({ type: "FAILED", payload: error.response.data.error }))
            .finally(() => setIsLoading(false))
    }

    return (
        <div className="full-cont">
            <div className="user-details">
                <i className="fa-solid fa-xmark" onClick={() => setUserToShow(null)} />
                <h1>User Details</h1>
                <h2>{userToShow.email}</h2>
                <div className="user-details-content">
                    <img src={userToShow.details?.img} />
                    <div className="info">
                        <p>{userToShow.details?.name}</p>
                        <p>{userToShow.details?.age}</p>
                        <p>{userToShow.details?.sex}</p>
                        <p>{userToShow.details?.contact}</p>
                    </div>
                </div>
                {isLoading ?
                    <Loader2 />
                    :
                    <div className="books">
                        <h3>Booking History</h3>
                        <div className="book-wrapper">
                            {books.map(book => (
                                <div className="book" key={book._id}>
                                    <h4>{book.status}</h4>
                                    <hr />
                                    <p>{format(book.from, 'LLLL d' + (new Date(book.from).getFullYear() === new Date(book.to).getFullYear() ? '' : ', yyyy'))} - {format(book.to, (new Date(book.from).getMonth() === new Date(book.to).getMonth() ? '' : 'LLL ') + 'd, yyyy')}</p>
                                    <p>{book.room.map(r => `${r.roomType} - Room ${r.roomNo}`)}</p>
                                    <p>Total: ₱<b>{book.total.toLocaleString()}</b></p>
                                    <p>Paid: ₱<b>{book.payed.toLocaleString()}</b></p>
                                </div>
                            ))}
                        </div>
                    </div>
                }
            </div>
        </div>
    )
}

export default UserDetails