import { useState, useEffect } from "react"
import Loader from "../components/Loader"
import "../styles/booking.css"
import axios from "axios"
import { isPast, isAfter, formatDistance, format } from 'date-fns'

const convertToISO = (date) => {
    return date.toISOString().split('T')[0]
}

const dateToday = new Date()
const dateTomorrow = new Date()
dateTomorrow.setDate(dateTomorrow.getDate() + 1)

const Booking = () => {
    const [isLoading, setIsLoading] = useState(true)

    const [checkIn, setCheckIn] = useState(dateToday)
    const [checkOut, setCheckOut] = useState(dateTomorrow)

    const [roomTypes, setRoomTypes] = useState(null)
    const [selectedRoomTypes, setSelectedRoomTypes] = useState([])

    const [page, setPage] = useState("date")

    useEffect(() => {
        const fetchRoomTypes = async () => {
            axios.get('room-type/all')
                .then(res => {
                    setRoomTypes(res.data.roomTypes)
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

        if (isAfter(checkIn, checkOut)) {
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
                                <input type="date" value={convertToISO(checkIn)} onChange={e => setCheckIn(new Date(e.target.value))} />
                            </div>
                            <div className="date-wrapper">
                                <label>Check Out:</label>
                                <input type="date" value={convertToISO(checkOut)} onChange={e => setCheckOut(new Date(e.target.value))} />
                            </div>
                            <div className="date-wrapper">
                                <label>Total Period:</label>
                                <p>{formatDistance(checkIn, checkOut)}</p>
                            </div>
                            <button onClick={handleSearchAvailability}>Search Availability</button>
                        </div>
                    }
                    {page === "room" &&
                        <div className="room-picker">
                            <div className="date">
                                <p><b>{format(checkIn, 'LLLL d, yyyy')}</b> to <b>{format(checkOut, 'LLLL d, yyyy')}</b></p>
                                <p>({formatDistance(checkIn, checkOut)})</p>
                            </div>
                            {selectedRoomTypes.length > 0 &&
                                <div className="selected-room-type-wrapper">
                                    {selectedRoomTypes?.map((roomType, i) => (
                                        <div key={i}>
                                            <div className="selected-room-type">
                                                <div className="top">
                                                    <h3>{roomType.name}</h3>
                                                    <div className="right">
                                                        <p>₱{roomType.rate} + {roomType.addedPerson * roomType.addFeePerPerson}</p>
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
                                        </div>
                                    ))}
                                    <div className="total">
                                        <h3>Total:</h3>
                                        <p>₱{selectedRoomTypes.reduce((acc, curr) => acc + curr.rate + (curr.addedPerson * curr.addFeePerPerson), 0)}</p>
                                    </div>
                                    <button>Continue</button>
                                </div>
                            }
                            {roomTypes.map(roomType => (
                                <div className="room-type" key={roomType._id}>
                                    <img src={roomType.img} />
                                    <div className="room-type-info">
                                        <h3>{roomType.name}</h3>
                                        <p>₱{roomType.rate}</p>
                                        <p>{Array.from({ length: roomType.maxPerson }, (_, i) => <i className={"fa-solid fa-person" + (i % 2 !== 0 ? "-dress" : "")} key={i} />)} (<i className="fa-solid fa-person-circle-plus" />₱{roomType.addFeePerPerson})</p>
                                    </div>
                                    <i className="fa-solid fa-plus" onClick={() => setSelectedRoomTypes(prev => [...prev, { ...roomType, addedPerson: 0 }])} />
                                </div>
                            ))}
                        </div>
                    }
                </div>
            }
        </div>
    )
}

export default Booking