import { useState, useEffect, useRef } from "react"
import axios from "axios"
import Loader2 from "./Loader2"
import useAdmin from '../hooks/useAdmin'
import { motion, AnimatePresence } from "framer-motion"
import DatePicker from "react-datepicker"
import AvailableRooms from "./AvailableRooms"


const ChangeBook = ({ fetchTotals, convertToNight, setBooks, setToChange, toChange }) => {
    const { dispatch } = useAdmin()

    const [isLoading, setIsLoading] = useState(true)
    const [isRoomNoLoading, setIsRoomNoLoading] = useState(true)

    const [roomTypes, setRoomTypes] = useState([])
    const [availableRooms, setAvailableRooms] = useState([])

    const [roomStart, setRoomStart] = useState(null)
    const [roomEnd, setRoomEnd] = useState(null)

    const total = toChange.room.reduce((acc, curr) => acc + curr.rate + (curr.addedPerson * curr.addedPersonRate), 0) * Math.ceil((new Date(toChange.to).setHours(roomEnd, 0, 0, 0) - new Date(toChange.from).setHours(roomStart, 0, 0, 0)) / (1000 * 60 * 60 * 24)) || 0
    const [addPay, setAddPay] = useState("")

    useEffect(() => {
        fetchRoomTypes()
        fetchAvailableRooms(toChange.from, toChange.to)
    }, [])

    useEffect(() => {
        setToChange(prev => ({ ...prev, total }))
    }, [total])

    const fetchAvailableRooms = async (from, to) => {
        setIsRoomNoLoading(true)

        axios.post("room-type/available-rooms", { from, to, bookedRooms: toChange.room })
            .then(res => setAvailableRooms(res.data))
            .catch((err) => {
                dispatch({ type: 'FAILED', payload: err.response.data.error })
                console.log(err.response.data.error)
            })
            .finally(() => setIsRoomNoLoading(false))
    }

    const fetchRoomTypes = async () => {
        axios.get("room-type/all")
            .then(res => setRoomTypes(res.data.roomTypes))
            .catch((err) => {
                dispatch({ type: 'FAILED', payload: err.response.data.error })
                console.log(err.response.data.error)
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
                console.log(err.response.data.error)
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

        setToChange(prev => ({ ...prev, room: [...prev.room, newRoom] }))
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

        setToChange(prev => ({ ...prev, room: prev.room.map(r => r._id === room._id ? newRoom : r) }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (addPay > toChange.balance) {
            dispatch({ type: 'FAILED', payload: "the amount is overpaid" })
            return
        }

        let duplicateRoomNo = 0
        let duplicateInRoomType = ""

        if (toChange.room.length === 0) {
            dispatch({ type: 'FAILED', payload: "please add room" })
            return
        }

        if (toChange.room.some(room => room.roomNo == 0)) {
            dispatch({ type: 'FAILED', payload: "please fill all room number" })
            return
        }

        toChange.room.forEach((room, i) => {
            toChange.room.forEach((r, j) => {
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

        axios.patch("book/edit", {
            ...toChange,
            payed: addPay ? toChange.payed + parseInt(addPay) : toChange.payed,
            from: new Date(toChange.from).setHours(roomStart, 0, 0, 0),
            to: new Date(toChange.to).setHours(roomEnd, 0, 0, 0)
        })
            .then(res => {
                setToChange(null)
                setBooks(prev => prev.map(book => book._id === toChange._id ? res.data : book))
                dispatch({ type: 'SUCCESS', payload: true })
                fetchTotals()
            })
            .catch((err) => {
                dispatch({ type: 'FAILED', payload: err.response.data.error })
                console.log(err.response.data.error)
            })
            .finally(() => setIsLoading(false))
    }

    const handleChangeDate = (date) => {
        const [start, end] = date

        setToChange(prev => ({ ...prev, from: start, to: end }))
        if (end) {
            fetchAvailableRooms(start, end)
            setToChange(prev => ({ ...prev, room: prev.room.map(room => ({ ...room, roomNo: 0 })) }))
        }
    }

    return (
        <div className="full-cont">
            <form onSubmit={handleSubmit} className="confirm-book">
                {isLoading ?
                    <Loader2 />
                    :
                    <>
                        <i onClick={() => setToChange(null)} className="fa-solid fa-xmark" />
                        <h1>Change Reservation</h1>
                        <hr />
                        <div className="info">
                            <h2>{toChange.user.name} ({toChange.user.sex + ", " + toChange.user.age})</h2>
                            <h3>{toChange.user.email}</h3>
                            <h4>{toChange.user.contact}</h4>
                        </div>
                        <hr />
                        <div className="date-wrapper">
                            <h2>Total Period: {convertToNight(toChange.from, toChange.to)}</h2>
                            <DatePicker
                                withPortal
                                selectsRange
                                shouldCloseOnSelect={false}
                                selected={toChange.from}
                                startDate={toChange.from}
                                endDate={toChange.to}
                                minDate={new Date()}
                                monthsShown={2}
                                onChange={handleChangeDate}
                            />
                        </div>
                        <AvailableRooms availableRooms={availableRooms} />
                        <hr />
                        {isRoomNoLoading ?
                            <Loader2 />
                            :
                            <div className="selected-rooms">
                                <AnimatePresence mode="sync">
                                    {toChange?.room.map(room => (
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
                                                    <select value={room.roomNo} onChange={(e) => setToChange(prev => ({ ...prev, room: prev.room.map(r => r._id === room._id ? { ...r, roomNo: e.target.value } : r) }))}>
                                                        <option value="0">
                                                            {availableRooms.filter(r => r.roomType === room.roomType)[0].rooms.filter(r => r.available).length === 0 ?
                                                                "no available room"
                                                                :
                                                                "--select room num--"
                                                            }
                                                        </option>
                                                        {availableRooms.length > 0 && availableRooms.filter(r => r.roomType === room.roomType)[0].rooms.map(room => room.available && (
                                                            <option key={room.roomNo} value={room.roomNo}>{room.roomNo}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div className="add-person">
                                                    <i className="fa-solid fa-user-plus" onClick={() => setToChange(prev => ({ ...prev, room: prev.room.map(r => r._id === room._id ? { ...r, addedPerson: r.addedPerson + 1 } : r) }))} />
                                                    <h2>{room.addedPerson}</h2>
                                                    <i className="fa-solid fa-user-minus" onClick={() => setToChange(prev => ({ ...prev, room: prev.room.map(r => r._id === room._id ? { ...r, addedPerson: Math.max(r.addedPerson - 1, 0) } : r) }))} />
                                                </div>
                                            </div>
                                            <div className="right">
                                                <i className="fa-solid fa-minus" onClick={() => setToChange(prev => ({ ...prev, room: prev.room.filter(r => r._id !== room._id) }))} />
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
                                <h2>Total:</h2>
                                <h2>₱{total}</h2>
                            </div>
                            <div className="total">
                                <h2>Payed:</h2>
                                <h2>₱{toChange.payed}</h2>
                            </div>
                            <div className="total">
                                <h2>Remaining:</h2>
                                <h2>₱{toChange.balance}</h2>
                            </div>
                            <div className="total">
                                <h2>Add payment:</h2>
                                <input value={addPay} onChange={(e) => setAddPay(e.target.value)} type="number" />
                            </div>
                        </div>
                        <hr />
                        <div className="bttns">
                            <button disabled={isLoading || isRoomNoLoading} type="submit" className="green">Save</button>
                            <button className="red" onClick={() => setToChange(null)}>Back</button>
                        </div>
                    </>
                }
            </form >
        </div >
    )
}

export default ChangeBook