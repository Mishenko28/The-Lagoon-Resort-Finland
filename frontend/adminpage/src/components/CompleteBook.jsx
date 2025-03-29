import { useEffect, useRef, useState } from "react"
import { format, formatDistance, isFuture } from "date-fns"
import Loader2 from "./Loader2"
import axios from "axios"
import useAdmin from "../hooks/useAdmin"



const CompleteBook = ({ fetchTotals, convertToNight, setBooks, setToComplete, toComplete }) => {
    const { dispatch } = useAdmin()
    const [isLoading, setIsLoading] = useState(false)

    const [lastPayment, setLastPayment] = useState(toComplete.balance)
    const lastPaymentRef = useRef(null)

    useEffect(() => {
        lastPaymentRef.current && lastPaymentRef.current.focus()
    }, [lastPaymentRef])

    const handleSubmit = async (e) => {
        e.preventDefault()

        setIsLoading(true)

        axios.post("book/add-completed", { _id: toComplete._id, total: toComplete.total, payed: toComplete.payed + parseInt(lastPayment) })
            .then(res => {
                setBooks(prev => prev.filter(book => book._id !== res.data._id))
                setToComplete(null)
                dispatch({ type: 'SUCCESS', payload: true })
                fetchTotals()
            })
            .catch((err) => {
                dispatch({ type: 'FAILED', payload: err.response.data.error })
                console.log(err.response.data.error)
            })
            .finally(() => setIsLoading(false))
    }

    return (
        <div className="full-cont">
            <form onSubmit={handleSubmit} className="set-confirm-book">
                <h1>Set as completed?</h1>
                {isFuture(toComplete.to) && <p><i className="fa-solid fa-triangle-exclamation" /> {`There are ${formatDistance(toComplete.from, toComplete.to)} remaining for this reservation`}</p>}
                <hr />
                <div className="book-info">
                    {isLoading ?
                        <Loader2 />
                        :
                        <>
                            <h2>{toComplete.user.name} ({toComplete.user.sex}, {toComplete.user.age})</h2>
                            <h2>{toComplete.user.email}</h2>
                            <h2>{format(toComplete.from, 'LLL d' + (new Date(toComplete.from).getFullYear() === new Date(toComplete.to).getFullYear() ? '' : ', yyyy'))} - {format(toComplete.to, (new Date(toComplete.from).getMonth() === new Date(toComplete.to).getMonth() ? '' : 'LLL ') + 'd, yyyy')} ({convertToNight(toComplete.from, toComplete.to)})</h2>
                            <hr />
                            <div className="room">
                                {toComplete.room.map((room, i) => (
                                    <h2 key={room._id}>{room.roomType}</h2>
                                ))}
                            </div>
                            <hr />
                            <h2>Total: {toComplete.total}</h2>
                            <h2>Payed: {toComplete.payed}</h2>
                            <h2>Remaining: {toComplete.balance}</h2>
                            <hr />
                            <h2>Last Payment: <input ref={lastPaymentRef} required value={lastPayment} onChange={e => setLastPayment(e.target.value)} type="number" /></h2>
                        </>
                    }
                </div>
                <hr />
                <div className="bttns">
                    <button type="submit" disabled={isLoading} className="green">Yes</button>
                    <button onClick={() => setToComplete(null)} className="red">Back</button>
                </div>
            </form>
        </div>
    )
}

export default CompleteBook