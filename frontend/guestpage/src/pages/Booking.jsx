import { useState, useEffect } from "react"
import Loader from "../components/Loader"
import "../styles/booking.css"
import axios from "axios"
import { isPast, isAfter, formatDistance, format, isEqual } from 'date-fns'
import { motion, AnimatePresence } from "framer-motion"

const convertToISO = (date) => {
    return date.toISOString().split('T')[0]
}

const dateToday = new Date()
const dateTomorrow = new Date()
dateTomorrow.setDate(dateTomorrow.getDate() + 1)

const Booking = () => {
    const [isLoading, setIsLoading] = useState(true)

    const [checkIn, setCheckIn] = useState(new Date())
    const [checkOut, setCheckOut] = useState(new Date())

    const [roomTypes, setRoomTypes] = useState(null)
    const [selectedRoomTypes, setSelectedRoomTypes] = useState([])

    const [downPayment, setDownPayment] = useState(null)
    const [roomStart, setRoomStart] = useState(null)

    const [page, setPage] = useState("date")

    useEffect(() => {
        if (roomStart) {
            setCheckIn(new Date(dateToday.setHours(roomStart, 0, 0, 0)))
            setCheckOut(new Date(dateTomorrow.setHours(roomStart, 0, 0, 0)))
        }
    }, [roomStart])

    useEffect(() => {
        const fetchRoomTypes = async () => {
            axios.get('room-type/all')
                .then(res => {
                    setRoomTypes(res.data.roomTypes)
                })
                .finally(() => fetchAdminSettings())

        }

        const fetchAdminSettings = async () => {
            axios.get('admin-settings/all')
                .then(res => {
                    setDownPayment(res.data.adminSetting.downPayment)
                    setRoomStart(res.data.adminSetting.roomStart)
                })
                .finally(() => setIsLoading(false))
        }

        fetchRoomTypes()
    }, [])

    const handleSearchAvailability = () => {
        if (!checkIn || !checkOut) return
        setPage("room")
    }

    useEffect(() => {
        if (isPast(checkIn)) {
            setCheckIn(dateToday)
        }

        if (isAfter(checkIn, checkOut) || isEqual(checkIn, checkOut)) {
            const date = new Date(checkIn)
            setCheckOut(new Date(date.setDate(date.getDate() + 1)))
        }

    }, [checkIn, checkOut])

    return (
        <div className="booking">
            <div className="header-page">
                <img src="/aboutUsBG.jpg" />
                <h1>BOOKING</h1>
                <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Cupiditate accusantium iste reprehenderit molestias sint qui obcaecati ut?</p>
            </div>
            {isLoading ?
                <Loader />
                :
                <div className="reservation-form">
                    <h1>RESERVATION FORM</h1>
                    <hr />
                    {page === "date" &&
                        <div className="date-picker">
                            <div className="date-wrapper">
                                <label>Check In:</label>
                                <input type="date" value={convertToISO(checkIn)} onChange={e => setCheckIn(new Date(new Date(e.target.value).setHours(roomStart, 0, 0, 0)))} />
                            </div>
                            <div className="date-wrapper">
                                <label>Check Out:</label>
                                <input type="date" value={convertToISO(checkOut)} onChange={e => setCheckOut(new Date(new Date(e.target.value).setHours(roomStart, 0, 0, 0)))} />
                            </div>
                            <div className="date-wrapper">
                                <label>Total Period:</label>
                                <p>{formatDistance(checkIn, checkOut)}</p>
                            </div>
                            <button onClick={handleSearchAvailability}>Search Availability</button>
                        </div>
                    }
                    {page === "room" &&
                        <div className="room-picker" >
                            <AnimatePresence mode="popLayout">
                                <motion.div
                                    layout
                                    initial={{ opacity: 0.5, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    transition={{ duration: 0.3 }}
                                    className="date"
                                    key="date"
                                    onClick={() => setPage("date")}
                                >
                                    <p><b>{format(checkIn, 'LLLL d, yyyy')}</b> to <b>{format(checkOut, 'LLLL d, yyyy')}</b></p>
                                    <p>({formatDistance(checkIn, checkOut)})</p>
                                </motion.div>
                                {selectedRoomTypes.length > 0 &&
                                    <motion.div
                                        layout
                                        initial={{ opacity: 0.5, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                        transition={{ duration: 0.3 }}
                                        className="selected-room-type-wrapper"
                                        key="selected-room-type"
                                    >
                                        <AnimatePresence mode="popLayout">
                                            {selectedRoomTypes?.map((roomType, i) => (
                                                <motion.div
                                                    layout
                                                    initial={{ opacity: 0.5, scale: 0.9 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    exit={{ opacity: 0, scale: 0.8 }}
                                                    transition={{ duration: 0.3 }}
                                                    key={roomType.animationId}
                                                >
                                                    <div className="selected-room-type">
                                                        <div className="top">
                                                            <h3>{roomType.name}</h3>
                                                            <div className="right">
                                                                <p>₱{roomType.rate} {roomType.addedPerson > 0 && "+ " + roomType.addedPerson * roomType.addFeePerPerson}</p>
                                                                <i className="fa-solid fa-square-minus" onClick={() => setSelectedRoomTypes(prev => prev.filter((_, index) => index !== i))} />
                                                            </div>
                                                        </div>
                                                        <div className="bottom">
                                                            <div onClick={() => setSelectedRoomTypes(prev => prev.map((roomType, index) => index === i ? { ...roomType, addedPerson: roomType.addedPerson++ } : roomType))} className="left">
                                                                <i className="fa-solid fa-user-plus" />
                                                                <p>₱{roomType.addFeePerPerson}</p>
                                                            </div>
                                                            <i onClick={() => setSelectedRoomTypes(prev => prev.map((roomType, index) => index === i ? { ...roomType, addedPerson: Math.max(roomType.addedPerson--, 0) } : roomType))} className="fa-solid fa-user-minus" />
                                                            <p>{Array.from({ length: roomType.maxPerson }, (_, i) => <i className={"fa-solid fa-person" + (i % 2 !== 0 ? "-dress" : "")} key={i} />)}</p>
                                                            {roomType.addedPerson > 0 &&
                                                                <p>+ {Array.from({ length: roomType.addedPerson }, (_, i) => <i className={"fa-solid fa-person" + (i % 2 !== 0 ? "-dress" : "")} key={i} />)}</p>
                                                            }
                                                            <p>({roomType.maxPerson + roomType.addedPerson})</p>
                                                        </div>
                                                    </div>
                                                    <hr />
                                                </motion.div>
                                            ))}
                                        </AnimatePresence>
                                        <div className="total">
                                            <h3>Down Payment: ({downPayment * 100}%)</h3>
                                            <p>₱{selectedRoomTypes.reduce((acc, curr) => acc + curr.rate + (curr.addedPerson * curr.addFeePerPerson), 0) * downPayment * Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24))}</p>
                                        </div>
                                        <div className="total">
                                            <h3>Total:</h3>
                                            <p>₱{selectedRoomTypes.reduce((acc, curr) => acc + curr.rate + (curr.addedPerson * curr.addFeePerPerson), 0) * Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24))}</p>
                                        </div>
                                        <button>Continue</button>
                                    </motion.div>
                                }
                                {roomTypes.map(roomType => (
                                    <motion.div
                                        layout
                                        initial={{ opacity: 0.5, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                        transition={{ duration: 0.3 }}
                                        className="room-type"
                                        key={roomType._id}
                                    >
                                        <img src={roomType.img} />
                                        <div className="room-type-info">
                                            <h3>{roomType.name}</h3>
                                            <p>₱{roomType.rate}</p>
                                            <p>{Array.from({ length: roomType.maxPerson }, (_, i) => <i className={"fa-solid fa-person" + (i % 2 !== 0 ? "-dress" : "")} key={i} />)} (<i className="fa-solid fa-person-circle-plus" />₱{roomType.addFeePerPerson})</p>
                                        </div>
                                        <i className="fa-solid fa-plus" onClick={() => setSelectedRoomTypes(prev => [...prev, { ...roomType, addedPerson: 0, animationId: Math.floor(100000 + Math.random() * 900000) }])} />
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    }
                </div>
            }
        </div>
    )
}

export default Booking