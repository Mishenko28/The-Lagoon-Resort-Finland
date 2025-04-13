import { useState, useEffect, useRef } from "react"
import axios from "axios"
import Loader2 from "./Loader2"
import useAdmin from '../hooks/useAdmin'
import { motion, AnimatePresence } from "framer-motion"
import DatePicker from "react-datepicker"
import AvailableRooms from "./AvailableRooms"


export default function ConfirmBook({ fetchTotals, convertToNight, setBooks, toConfirm, setToConfirm }) {
    const { dispatch } = useAdmin()

    const [isLoading, setIsLoading] = useState(true)
    const [isRoomNoLoading, setIsRoomNoLoading] = useState(true)

    const [roomTypes, setRoomTypes] = useState([])
    const [availableRooms, setAvailableRooms] = useState([])

    const [roomStart, setRoomStart] = useState(null)
    const [roomEnd, setRoomEnd] = useState(null)

    const paymentRef = useRef(null)

    const total = toConfirm.room.reduce((acc, curr) => acc + curr.rate + (curr.addedPerson * curr.addedPersonRate), 0) * Math.ceil((new Date(toConfirm.to).setHours(roomEnd, 0, 0, 0) - new Date(toConfirm.from).setHours(roomStart, 0, 0, 0)) / (1000 * 60 * 60 * 24)) || 0
    const [payed, setPayed] = useState(toConfirm.deposit)

    useEffect(() => {
        if (paymentRef.current) paymentRef.current.focus()
    }, [paymentRef])

    useEffect(() => {
        setToConfirm(prev => ({ ...prev, total, deposit: total * toConfirm.downPayment }))
    }, [total])

    useEffect(() => {
        fetchRoomTypes()
        fetchAvailableRooms(toConfirm.from, toConfirm.to)
    }, [])

    const fetchAvailableRooms = async (from, to) => {
        setIsRoomNoLoading(true)

        axios.post("room-type/available-rooms", { from, to })
            .then(res => {
                setAvailableRooms(res.data)
                setToConfirm(prev => ({ ...prev, room: prev.room.map(room => ({ ...room, roomNo: 0 })) }))
            })
            .catch((err) => {
                dispatch({ type: 'FAILED', payload: err.response.data.error })
            })
            .finally(() => setIsRoomNoLoading(false))
    }

    const fetchRoomTypes = async () => {
        axios.get("room-type/all")
            .then(res => setRoomTypes(res.data.roomTypes))
            .catch((err) => {
                dispatch({ type: 'FAILED', payload: err.response.data.error })
            })
            .finally(() => fetchRoomStart())
    }

    const fetchRoomStart = async () => {
        axios.get("admin-settings/all")
            .then(res => {
                setRoomStart(res.data.adminSetting.roomStart)
                setRoomEnd(res.data.adminSetting.roomEnd)
            })
            .catch((err) => {
                dispatch({ type: 'FAILED', payload: err.response.data.error })
            })
            .finally(() => setIsLoading(false))
    }

    const createNewRoom = () => {
        const newRoom = {
            addedPerson: 0,
            addedPersonRate: roomTypes[0].addFeePerPerson,
            maxPerson: roomTypes[0].maxPerson,
            rate: roomTypes[0].rate,
            roomNo: 0,
            roomType: roomTypes[0].name,
            _id: Date.now()
        }

        setToConfirm(prev => ({ ...prev, room: [...prev.room, newRoom] }))
    }

    const handleChangeRoomType = (e, room) => {
        const newRoom = {
            ...room,
            roomType: e.target.value,
            maxPerson: roomTypes.find(rt => rt.name === e.target.value).maxPerson,
            rate: roomTypes.find(rt => rt.name === e.target.value).rate,
            addedPersonRate: roomTypes.find(rt => rt.name === e.target.value).addFeePerPerson,
            roomNo: 0
        }

        setToConfirm(prev => ({ ...prev, room: prev.room.map(r => r._id === room._id ? newRoom : r) }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!toConfirm.to) {
            dispatch({ type: 'FAILED', payload: "please select the check out date" })
            return
        }

        if (new Date(toConfirm.from).getDate() == new Date(toConfirm.to).getDate()) {
            dispatch({ type: 'FAILED', payload: "check in and check out can not be the same" })
            return
        }
        if (payed <= 0) {
            dispatch({ type: 'FAILED', payload: "please fill payment" })
            return
        }

        if (payed > total) {
            dispatch({ type: 'FAILED', payload: "the amount is overpaid" })
            return
        }

        let duplicateRoomNo = 0
        let duplicateInRoomType = ""

        if (toConfirm.room.length === 0) {
            dispatch({ type: 'FAILED', payload: "please add room" })
            return
        }

        if (toConfirm.room.some(room => room.roomNo == 0)) {
            dispatch({ type: 'FAILED', payload: "please fill all room number" })
            return
        }

        toConfirm.room.forEach((room, i) => {
            toConfirm.room.forEach((r, j) => {
                if (i !== j && room.roomNo == r.roomNo && room.roomType === r.roomType) {
                    duplicateRoomNo = room.roomNo
                    duplicateInRoomType = room.roomType
                }
            })
        })

        if (duplicateRoomNo > 0) {
            dispatch({ type: 'FAILED', payload: `duplicate room number ${duplicateRoomNo} in ${duplicateInRoomType}` })
            return
        }
        setIsLoading(true)

        axios.post("book/add-confirmed", { ...toConfirm, payed, from: new Date(toConfirm.from).setHours(roomStart, 0, 0, 0), to: new Date(toConfirm.to).setHours(roomEnd, 0, 0, 0) })
            .then(res => {
                setToConfirm(null)
                setBooks(prev => prev.filter(book => book._id !== res.data._id))
                dispatch({ type: 'SUCCESS', payload: true })
                fetchTotals()
            })
            .catch((err) => {
                dispatch({ type: 'FAILED', payload: err.response.data.error })
            })
            .finally(() => setIsLoading(false))
    }

    const handleChangeDate = (date) => {
        const [start, end] = date

        setToConfirm(prev => ({ ...prev, from: start, to: end }))
        end && fetchAvailableRooms(start, end)
    }

    return (
        <div className="full-cont">
            <form onSubmit={handleSubmit} className="confirm-book">
                {isLoading ?
                    <Loader2 />
                    :
                    <>
                        <i onClick={() => setToConfirm(null)} className="fa-solid fa-xmark" />
                        <h1>Confirm Reservation</h1>
                        <hr />
                        <div className="info">
                            <h2>{toConfirm.user.details.name} ({toConfirm.user.details.sex + ", " + toConfirm.user.details.age})</h2>
                            <h3>{toConfirm.user.email}</h3>
                            <h4>{toConfirm.user.details.contact}</h4>
                        </div>
                        <hr />
                        <div className="date-wrapper">
                            <h2>Total Period: {convertToNight(toConfirm.from, toConfirm.to)}</h2>
                            <DatePicker
                                withPortal
                                selectsRange
                                shouldCloseOnSelect={false}
                                selected={toConfirm.from}
                                startDate={toConfirm.from}
                                endDate={toConfirm.to}
                                minDate={new Date()}
                                monthsShown={2}
                                onChange={handleChangeDate}
                                className={!toConfirm.to || new Date(toConfirm.from).getDate() == new Date(toConfirm.to).getDate() ? "error" : ""}
                            />
                        </div>
                        <AvailableRooms availableRooms={availableRooms} />
                        <hr />
                        {isRoomNoLoading ?
                            <Loader2 />
                            :
                            <div className="selected-rooms">
                                <AnimatePresence mode="sync">
                                    {toConfirm?.room.map(room => (
                                        <motion.div
                                            layout
                                            initial={{ opacity: 0.5, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.8 }}
                                            transition={{ duration: 0.3 }}
                                            className="room"
                                            key={room._id}
                                        >
                                            <div className="left">
                                                <div className="select-room">
                                                    <select value={room.roomType} onChange={(e) => handleChangeRoomType(e, room)}>
                                                        {roomTypes.map(roomType => (
                                                            <option key={roomType._id} value={roomType.name}>{roomType.name}</option>
                                                        ))}
                                                    </select>
                                                    <select value={room.roomNo} onChange={(e) => setToConfirm(prev => ({ ...prev, room: prev.room.map(r => r._id === room._id ? { ...r, roomNo: e.target.value } : r) }))} className={room.roomNo == 0 ? "error" : ""}>
                                                        <option value="0">
                                                            {availableRooms.filter(r => r.roomType === room.roomType)[0].rooms.filter(r => r.available).length === 0 ?
                                                                "no available room"
                                                                :
                                                                "--select room num--"
                                                            }
                                                        </option>
                                                        {availableRooms.filter(r => r.roomType === room.roomType)[0].rooms.map(room => room.available && (
                                                            <option key={room.roomNo} value={room.roomNo}>{room.roomNo}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div className="add-person">
                                                    <i className="fa-solid fa-user-plus" onClick={() => setToConfirm(prev => ({ ...prev, room: prev.room.map(r => r._id === room._id ? { ...r, addedPerson: r.addedPerson + 1 } : r) }))} />
                                                    <h2>{room.addedPerson}</h2>
                                                    <i className="fa-solid fa-user-minus" onClick={() => setToConfirm(prev => ({ ...prev, room: prev.room.map(r => r._id === room._id ? { ...r, addedPerson: Math.max(r.addedPerson - 1, 0) } : r) }))} />
                                                </div>
                                            </div>
                                            <div className="right">
                                                <i className="fa-solid fa-minus" onClick={() => setToConfirm(prev => ({ ...prev, room: prev.room.filter(r => r._id !== room._id) }))} />
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                                <motion.div whileTap={{ scale: 0.9 }} className="room" onClick={createNewRoom}><i className="fa-solid fa-plus" /></motion.div>
                            </div>
                        }
                        <hr />
                        <div className="total-wrapper">
                            <div className="total">
                                <h2>Down payment({toConfirm.downPayment * 100}%):</h2>
                                <h2>₱{total * toConfirm.downPayment < 0 ? 0 : total * toConfirm.downPayment}</h2>
                            </div>
                            <div className="total">
                                <h2>Total:</h2>
                                <h2>₱{total < 0 ? 0 : total}</h2>
                            </div>
                            <div className="total">
                                <h2>Payment received:</h2>
                                <input value={payed} onChange={(e) => setPayed(e.target.value)} ref={paymentRef} required type="number" />
                            </div>
                        </div>
                        <hr />
                        <div className="bttns">
                            <button className="submit" disabled={isLoading || isRoomNoLoading} type="submit">Confirm</button>
                            <button className="cancel" onClick={() => setToConfirm(null)}>Back</button>
                        </div>
                    </>
                }
            </form >
        </div >
    )
}
