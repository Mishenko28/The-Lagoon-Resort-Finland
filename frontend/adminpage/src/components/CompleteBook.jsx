import { useEffect, useRef, useState } from "react"
import { format, formatDistance, isFuture } from "date-fns"
import Loader2 from "./Loader2"
import axios from "axios"
import useAdmin from "../hooks/useAdmin"
import { motion, AnimatePresence } from "framer-motion"


const CompleteBook = ({ fetchTotals, convertToNight, setBooks, setToComplete, toComplete }) => {
    const { dispatch } = useAdmin()
    const [isLoading, setIsLoading] = useState(false)

    const [openAddChargeDropDown, setOpenAddChargeDropDown] = useState(false)
    const dropdownRef = useRef(null)

    const [addCharges, setAddCharges] = useState([])

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpenAddChargeDropDown(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)

        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    })


    const handleSubmit = async (e) => {
        e.preventDefault()

        if (addCharges.some(charge => charge.amount <= 0)) {
            dispatch({ type: 'FAILED', payload: "additional charges can not be 0" })
            return
        }

        setIsLoading(true)

        axios.post("book/add-completed", { _id: toComplete._id, total: addCharges.reduce((total, current) => total + current.amount, toComplete.total), addCharges })
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

    const handleAddCharge = (value) => {
        let id

        do {
            id = Math.floor(Math.random() * 1000000)
        } while (addCharges.some(item => item.id === id))

        setAddCharges(prev => [{ id, charge: value, amount: 0 }, ...prev])
        setOpenAddChargeDropDown(false)
    }


    return (
        <div className="full-cont">
            <form onSubmit={handleSubmit} className="set-confirm-book">
                <h1>Set as completed?</h1>
                {isFuture(toComplete.to) && <p><i className="fa-solid fa-triangle-exclamation" /> {`There are ${formatDistance(toComplete.to, new Date())} remaining for this reservation`}</p>}
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
                            <h2>Room Total: ₱{toComplete.total}</h2>
                            <h2>Payed: ₱{toComplete.payed}</h2>
                            <h2>Remaining: ₱{toComplete.balance}</h2>
                            <hr />
                            <h2>Room Last Payment: <input disabled required value={toComplete.balance} type="text" /></h2>
                            <AnimatePresence mode="sync">
                                {addCharges.map(item => (
                                    <motion.h2
                                        layout
                                        initial={{ opacity: 0.5 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        key={item.id}
                                        className="payment"
                                    >
                                        <span><i className="fa-solid fa-square-xmark" onClick={() => setAddCharges(prev => prev.filter(charge => charge.id !== item.id))} /> {item.charge}</span>
                                        <input type="number" value={item.amount || ""} onChange={e => setAddCharges(prev => prev.map(charge => charge.id === item.id ? ({ ...charge, amount: parseInt(e.target.value) || 0 }) : charge))} />
                                    </motion.h2>
                                ))}
                            </AnimatePresence>
                            <hr />
                            <h2>Total: <b>₱ {addCharges.reduce((totalAmount, current) => current.amount + totalAmount, toComplete.balance)}</b></h2>
                            <hr />
                            <div ref={dropdownRef} className="add-charges">
                                <button type="button" onClick={() => setOpenAddChargeDropDown(!openAddChargeDropDown)} className="secondary">Additional Charges</button>
                                {openAddChargeDropDown &&
                                    <div className="charges">
                                        <h3 onClick={() => handleAddCharge("Extra Bed")}>Extra Bed</h3>
                                        <h3 onClick={() => handleAddCharge("Room Damage")}>Room Damage</h3>
                                        <h3 onClick={() => handleAddCharge("Missing Item")}>Missing Item</h3>
                                    </div>
                                }
                            </div>
                        </>
                    }
                </div>
                <hr />
                <div className="bttns">
                    <button type="submit" disabled={isLoading} className="green">Confirm</button>
                    <button onClick={() => setToComplete(null)} className="red">Back</button>
                </div>
            </form>
        </div>
    )
}

export default CompleteBook