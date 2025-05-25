import { useEffect, useState, useRef } from 'react'
import axios from 'axios'
import useAdmin from '../../hooks/useAdmin'
import RoomTypes from '../../components/RoomTypes'
import Loader2 from '../../components/Loader2'
import useConvertBase64 from '../../hooks/useConvertBase64'
import { motion, AnimatePresence } from 'framer-motion'
import DatePicker from "react-datepicker"
import { parse, format } from 'date-fns'

export default function Rooms() {
    const { dispatch } = useAdmin()
    const [base64, convertToBase64] = useConvertBase64("")

    const [adminSettings, setAdminSettings] = useState({})
    const [roomTypes, setRoomTypes] = useState([])
    const [rooms, setRooms] = useState([])

    const [isLoading, setIsLoading] = useState(true)
    const [newRoomTypeIsLoading, setNewRoomTypeIsLoading] = useState(false)
    const [changeDownPaymentIsLoading, setChangeDownPaymentIsLoading] = useState(false)
    const [changeCheckInOutIsLoading, setChangeCheckInOutIsLoading] = useState(false)

    const [isCard, setIsCard] = useState(true)
    const [sort, setSort] = useState({
        type: 'roomNo',
        order: 'asc'
    })
    const [sortTogg, setSortTogg] = useState(false)
    const sortRef = useRef()
    const sortSelectionRef = useRef()

    const [newDownPayment, setNewDownPayment] = useState(null)
    const newDownPaymentRef = useRef()

    const [newTime, setNewTime] = useState(null)

    const [newRoomTypeTogg, setNewRoomTypeTogg] = useState(false)
    const [newRoomType, setNewRoomType] = useState({
        name: '',
        img: base64,
        rate: '',
        caption: '',
        addFeePerPerson: '',
        maxPerson: ''
    })
    const newRoomTypeRef = useRef()

    useEffect(() => {
        setNewRoomType(prev => ({ ...prev, img: base64 }))
    }, [base64])

    useEffect(() => {
        const fetchAdminSettings = async () => {
            await axios.get('/admin-settings/all')
                .then((res) => {
                    setAdminSettings(res.data.adminSetting)
                })
                .catch((err) => {
                    dispatch({ type: 'FAILED', payload: err.response.data.error })
                })
        }

        const fetchRooms = async () => {
            await axios.get('/room/all')
                .then((res) => {
                    setRooms(res.data.rooms.sort((a, b) => a.roomNo - b.roomNo))
                })
                .catch((err) => {
                    dispatch({ type: 'FAILED', payload: err.response.data.error })
                })
        }
        const fetchRoomTypes = async () => {
            await axios.get('/room-type/all')
                .then((res) => {
                    setRoomTypes(res.data.roomTypes)
                })
                .catch((err) => {
                    dispatch({ type: 'FAILED', payload: err.response.data.error })
                })
        }

        const fetchAll = async () => {
            await fetchAdminSettings()
            await fetchRooms()
            await fetchRoomTypes()
            setIsLoading(false)
        }

        fetchAll()
    }, [])

    useEffect(() => {
        const handleClick = e => {
            if (sortRef.current && !sortRef.current.contains(e.target) && sortSelectionRef.current && !sortSelectionRef.current.contains(e.target)) {
                setSortTogg(false)
            }
        }

        document.addEventListener('click', handleClick)

        return () => {
            document.removeEventListener('click', handleClick)
        }
    }, [])

    useEffect(() => {
        const sortedRooms = [...rooms].sort((a, b) => {
            if (sort.type === "roomNo") {
                return sort.order === "asc" ? a.roomNo - b.roomNo : b.roomNo - a.roomNo
            } else if (sort.type === "active") {
                return sort.order === "asc" ? b.active - a.active : a.active - b.active
            } else if (sort.type === "created") {
                return sort.order === "asc" ? new Date(b.createdAt) - new Date(a.createdAt) : new Date(a.createdAt) - new Date(b.createdAt)
            }
            return 0
        })

        if (JSON.stringify(sortedRooms) === JSON.stringify(rooms)) {
            return
        }

        setRooms(sortedRooms)
    }, [sort, rooms])

    useEffect(() => {
        newRoomTypeTogg && newRoomTypeRef.current.focus()
    }, [newRoomTypeTogg])

    useEffect(() => {
        newDownPayment && newDownPaymentRef.current.focus()
    }, [newDownPayment])

    const createNewRoomType = async (e) => {
        e.preventDefault()

        if (!newRoomType.name || !newRoomType.rate || !newRoomType.addFeePerPerson || !newRoomType.maxPerson || !newRoomType.caption || !newRoomType.img) {
            dispatch({ type: 'FAILED', payload: "Please fill out all fields" })
            return
        }

        setNewRoomTypeIsLoading(true)

        await axios.post('/room-type/add', { ...newRoomType })
            .then((res) => {
                setRoomTypes(prev => [res.data.roomType, ...prev])
                dispatch({ type: 'SUCCESS', payload: true })
                cancelNewRoomType()
            })
            .catch((err) => {
                dispatch({ type: 'FAILED', payload: err.response.data.error })
                    .log(err.response.data.error)
            })
            .finally(() => {
                setNewRoomTypeIsLoading(false)
            })
    }

    const updateCheckInOut = async (e) => {
        e.preventDefault()

        setChangeCheckInOutIsLoading(true)

        await axios.patch('/admin-settings/update', { roomStart: newTime.roomStart.getHours(), roomEnd: newTime.roomEnd.getHours() })
            .then((res) => {
                setAdminSettings(res.data.adminSetting)
                setNewTime(null)
                dispatch({ type: 'SUCCESS', payload: true })
            })
            .catch((err) => {
                dispatch({ type: 'FAILED', payload: err.response.data.error })
            })
            .finally(() => setChangeCheckInOutIsLoading(false))
    }

    const updateDownPayment = async (e) => {
        e.preventDefault()
        setChangeDownPaymentIsLoading(true)

        if (adminSettings.downPayment === newDownPayment) {
            dispatch({ type: 'FAILED', payload: "No changes" })
            setChangeDownPaymentIsLoading(false)
            return
        }

        await axios.patch('/admin-settings/update', { downPayment: newDownPayment })
            .then((res) => {
                setAdminSettings(res.data.adminSetting)
                setNewDownPayment(null)
                dispatch({ type: 'SUCCESS', payload: true })
            })
            .catch((err) => {
                dispatch({ type: 'FAILED', payload: err.response.data.error })
            })

        setChangeDownPaymentIsLoading(false)
    }

    const cancelNewRoomType = () => {
        setNewRoomTypeTogg(false)
        setNewRoomType({
            name: '',
            img: base64,
            rate: '',
            caption: '',
            addFeePerPerson: '',
            maxPerson: ''
        })
        convertToBase64(null)
    }

    const handleChangeTime = () => {
        const dateNow = new Date()

        setNewTime({
            roomStart: new Date(dateNow.setHours(adminSettings.roomStart, 0, 0, 0)),
            roomEnd: new Date(dateNow.setHours(adminSettings.roomEnd, 0, 0, 0))
        })
    }

    return (
        <>
            {isLoading ?
                <Loader2 />
                :
                <>
                    <div className="button-header">
                        <button onClick={() => setNewRoomTypeTogg(true)}><i className="fa-solid fa-folder-plus" />Create Room Type</button>
                        <button onClick={() => setNewDownPayment(adminSettings.downPayment)}><i className="fa-solid fa-square-pen" />Change Down Payment</button>
                        <button onClick={handleChangeTime}><i className="fa-solid fa-square-pen" />Change Check In and Out Hours</button>
                        <div className='sort-wrapper'>
                            <button ref={sortRef} onClick={() => setSortTogg(!sortTogg)}><i className="fa-solid fa-sort" />Sort Rooms</button>
                            {sortTogg &&
                                <div ref={sortSelectionRef} className='selections'>
                                    <h1 onClick={() => setSort(prev => ({ ...prev, type: "roomNo" }))}>{sort.type == "roomNo" && <i className="fa-solid fa-caret-right" />}Room Number</h1>
                                    <h1 onClick={() => setSort(prev => ({ ...prev, type: "active" }))}>{sort.type == "active" && <i className="fa-solid fa-caret-right" />}Active</h1>
                                    <h1 onClick={() => setSort(prev => ({ ...prev, type: "created" }))}>{sort.type == "created" && <i className="fa-solid fa-caret-right" />}Created</h1>
                                    <hr />
                                    <h1 onClick={() => setSort(prev => ({ ...prev, order: "asc" }))}>{sort.order == "asc" && <i className="fa-solid fa-caret-right" />}Ascending</h1>
                                    <h1 onClick={() => setSort(prev => ({ ...prev, order: "des" }))}>{sort.order == "des" && <i className="fa-solid fa-caret-right" />}Descending</h1>
                                </div>
                            }
                        </div>
                    </div>
                    <div className='infos'>
                        <h1>Rooms: <b>{rooms.length}</b></h1>
                        <h1>Down Payment: <b>{adminSettings.downPayment * 100}%</b></h1>
                        <h1>Check In: <b>{format(parse(adminSettings.roomStart.toString(), "H", new Date()), "h:mm a")}</b></h1>
                        <h1>Check Out: <b>{format(parse(adminSettings.roomEnd.toString(), "H", new Date()), "h:mm a")}</b></h1>
                    </div>
                    <AnimatePresence >
                        {newTime &&
                            <motion.form
                                layout
                                initial={{ opacity: 0.5, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{ duration: 0.3 }}
                                className='change-check-in-out'
                                key="change-check-in-out"
                                onSubmit={updateCheckInOut}
                            >
                                {changeCheckInOutIsLoading && <div className='loader-line'></div>}
                                <i onClick={() => setNewTime(null)} className="fa-solid fa-xmark" />
                                <div className='check-in-out'>
                                    <label>Check In:</label>
                                    <DatePicker
                                        selected={newTime.roomStart}
                                        onChange={(date) => setNewTime(prev => ({ ...prev, roomStart: date }))}
                                        showTimeSelectOnly
                                        showTimeSelect
                                        dateFormat="hh:mm aa"
                                    />
                                </div>
                                <div className='check-in-out'>
                                    <label>Check Out:</label>
                                    <DatePicker
                                        selected={newTime.roomEnd}
                                        onChange={(date) => setNewTime(prev => ({ ...prev, roomEnd: date }))}
                                        showTimeSelectOnly
                                        showTimeSelect
                                        dateFormat="hh:mm aa"
                                    />
                                </div>
                                <div className='bttns'>
                                    <button className='submit' type='submit'>Save</button>
                                    <button className='delete' type='button' onClick={() => setNewTime(null)} >Cancel</button>
                                </div>
                            </motion.form>
                        }
                        {newRoomTypeTogg &&
                            <motion.form
                                layout
                                initial={{ opacity: 0.5, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{ duration: 0.3 }}
                                onSubmit={createNewRoomType}
                                className='add-room-type'
                                key="add-room-type"
                            >
                                {newRoomTypeIsLoading && <div className='loader-line'></div>}
                                <h1>New Room Type:</h1>
                                <input type='text' ref={newRoomTypeRef} value={newRoomType.name} onChange={e => setNewRoomType(prev => ({ ...prev, name: e.target.value.toUpperCase() }))} placeholder='name' />
                                <input type='number' value={newRoomType.rate} onChange={e => setNewRoomType(prev => ({ ...prev, rate: e.target.value }))} placeholder='rate' />
                                <input type='number' value={newRoomType.addFeePerPerson} onChange={e => setNewRoomType(prev => ({ ...prev, addFeePerPerson: e.target.value }))} placeholder='additional fee for extra person/s' />
                                <input type='number' value={newRoomType.maxPerson} onChange={e => setNewRoomType(prev => ({ ...prev, maxPerson: e.target.value }))} placeholder='maximum person/s' />
                                <textarea value={newRoomType.caption} onChange={e => setNewRoomType(prev => ({ ...prev, caption: e.target.value }))} rows={4} placeholder='caption'></textarea>
                                <input onChange={(e) => convertToBase64(e.target.files[0])} accept=".png, .jpeg, .jpg" type="file" />
                                {newRoomType.img && <img src={newRoomType.img} />}
                                <button className='submit' disabled={newRoomTypeIsLoading} type='submit'>Add</button>
                                <i onClick={cancelNewRoomType} className="fa-solid fa-xmark" />
                            </motion.form>
                        }
                        {(newDownPayment || newDownPayment == "") &&
                            <motion.form
                                layout
                                initial={{ opacity: 0.5, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{ duration: 0.3 }}
                                onSubmit={updateDownPayment}
                                className='change-down-payment'
                                key="change-down-payment"
                            >
                                {changeDownPaymentIsLoading && <div className='loader-line'></div>}
                                <h1>Change Down Payment: Percentage (1-100)</h1>
                                <input ref={newDownPaymentRef} onChange={(e) => setNewDownPayment(Math.min(e.target.value / 100, 1))} value={newDownPayment * 100 === 0 ? "" : newDownPayment * 100} type='number' placeholder='type here' />
                                <button className='submit' disabled={!newDownPayment || changeDownPaymentIsLoading} type='submit'>Save</button>
                                <i onClick={() => setNewDownPayment(null)} className="fa-solid fa-xmark" />
                            </motion.form>
                        }
                        <motion.div layout className='card-and-table-togg-cont' key="card-and-table-togg-cont">
                            <button onClick={() => setIsCard(true)} style={isCard ? { backgroundColor: "var(--primary)", color: "#fff" } : null}>Card</button>
                            <button onClick={() => setIsCard(false)} style={!isCard ? { backgroundColor: "var(--primary)", color: "#fff" } : null}>Table</button>
                        </motion.div>
                        <motion.div layout className='room-types' key="room-types">
                            <AnimatePresence mode='sync'>
                                {roomTypes.map((roomType, i) => (
                                    <RoomTypes
                                        key={roomType._id}
                                        roomType={roomType}
                                        rooms={rooms.filter(room => room.roomType === roomType.name)}
                                        setRooms={setRooms}
                                        adminSettings={adminSettings}
                                        setRoomTypes={setRoomTypes}
                                        isCard={isCard}
                                    />
                                ))}
                            </AnimatePresence>
                        </motion.div>
                    </AnimatePresence>
                </>
            }
        </>
    )
}