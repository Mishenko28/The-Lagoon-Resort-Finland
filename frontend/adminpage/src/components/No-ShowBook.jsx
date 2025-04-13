import { useState } from "react"
import { format, formatDistance } from "date-fns"
import Loader2 from "./Loader2"
import axios from "axios"
import useAdmin from "../hooks/useAdmin"

const NoShowBook = ({ fetchTotals, convertToNight, setBooks, setToNoShow, toNoShow }) => {
    const { dispatch } = useAdmin()
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()

        setIsLoading(true)

        axios.post("book/add-noshow", { _id: toNoShow._id })
            .then(res => {
                setBooks(prev => prev.filter(book => book._id !== res.data._id))
                setToNoShow(null)
                dispatch({ type: 'SUCCESS', payload: true })
                fetchTotals()
            })
            .catch((err) => {
                dispatch({ type: 'FAILED', payload: err.response.data.error })
            })
            .finally(() => setIsLoading(false))
    }

    return (
        <div className="full-cont">
            <form onSubmit={handleSubmit} className="cancel-book">
                <h1>Set as No-show?</h1>
                <div className="no-show-book-info">
                    {isLoading ?
                        <Loader2 />
                        :
                        <>
                            <h2>{toNoShow.user.details.name} ({toNoShow.user.details.sex}, {toNoShow.user.details.age})</h2>
                            <h2>{toNoShow.user.details.email}</h2>
                            <h2>{format(toNoShow.from, 'LLL d' + (new Date(toNoShow.from).getFullYear() === new Date(toNoShow.to).getFullYear() ? '' : ', yyyy'))} - {format(toNoShow.to, (new Date(toNoShow.from).getMonth() === new Date(toNoShow.to).getMonth() ? '' : 'LLL ') + 'd, yyyy')} ({convertToNight(toNoShow.from, toNoShow.to)})</h2>
                            <div className="room">
                                {toNoShow.room.map(room => (
                                    <h2 key={room._id}>{room.roomType}</h2>
                                ))}
                            </div>
                            <h2>Total: {toNoShow.total}</h2>
                            <h2>Payed: {toNoShow.payed}</h2>
                        </>
                    }
                </div>
                <div className="bttns">
                    <button type="submit" disabled={isLoading} className="submit">Yes</button>
                    <button onClick={() => setToNoShow(null)} className="cancel">Back</button>
                </div>
            </form>
        </div>
    )
}

export default NoShowBook