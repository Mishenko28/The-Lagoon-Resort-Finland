import { useEffect, useState, useRef } from 'react'
import axios from 'axios'
import useAdmin from '../../hooks/useAdmin'
import RoomTypes from '../../components/RoomTypes'
import Loader2 from '../../components/Loader2'

export default function Rooms() {
    const { dispatch } = useAdmin()

    const [adminSettings, setAdminSettings] = useState({})
    const [rooms, setRooms] = useState([])

    const [isLoading, setIsLoading] = useState(true)
    const [newRoomTypeIsLoading, setNewRoomTypeIsLoading] = useState(false)
    const [changeDownPaymentIsLoading, setChangeDownPaymentIsLoading] = useState(false)

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

    const [newRoomTypeTogg, setNewRoomTypeTogg] = useState(false)
    const [newRoomType, setNewRoomType] = useState('')
    const newRoomTypeRef = useRef()

    useEffect(() => {
        const fetchAdminSettings = async () => {
            await axios.get('/admin-settings/all')
                .then((res) => {
                    setAdminSettings(res.data.adminSetting)
                })
                .catch((err) => {
                    dispatch({ type: 'FAILED', payload: err.response.data.error })
                    console.log(err.response.data.error)
                })
        }

        const fetchRooms = async () => {
            await axios.get('/room/all')
                .then((res) => {
                    setRooms(res.data.rooms.sort((a, b) => a.roomNo - b.roomNo))
                })
                .catch((err) => {
                    dispatch({ type: 'FAILED', payload: err.response.data.error })
                    console.log(err.response.data.error)
                })
        }

        const fetchAll = async () => {
            await fetchAdminSettings()
            await fetchRooms()
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
            } else if (sort.type === "rate") {
                return sort.order === "asc" ? a.rate - b.rate : b.rate - a.rate
            } else if (sort.type === "max") {
                return sort.order === "asc" ? a.maxPerson - b.maxPerson : b.maxPerson - a.maxPerson
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
        setNewRoomTypeIsLoading(true)

        await axios.patch('/admin-settings/update', { ...adminSettings, roomTypes: [...adminSettings.roomTypes, newRoomType] })
            .then((res) => {
                setAdminSettings(res.data.adminSetting)
                dispatch({ type: 'SUCCESS', payload: true })
                setNewRoomType('')
            })
            .catch((err) => {
                dispatch({ type: 'FAILED', payload: err.response.data.error })
                console.log(err.response.data.error)
            })

        setNewRoomTypeIsLoading(false)
        setNewRoomTypeTogg(false)
    }

    const updateDownPayment = async (e) => {
        e.preventDefault()
        setChangeDownPaymentIsLoading(true)

        await axios.patch('/admin-settings/update', { ...adminSettings, downPayment: newDownPayment })
            .then((res) => {
                setAdminSettings(res.data.adminSetting)
                dispatch({ type: 'SUCCESS', payload: true })
            })
            .catch((err) => {
                dispatch({ type: 'FAILED', payload: err.response.data.error })
                console.log(err.response.data.error)
            })

        setChangeDownPaymentIsLoading(false)
        setNewDownPayment(null)
    }

    return (
        <>
            {isLoading ?
                <Loader2 />
                :
                <>
                    <div className="config-header">
                        <button onClick={() => setNewRoomTypeTogg(true)}>Create Room Type</button>
                        <button onClick={() => setNewDownPayment(adminSettings.downPayment)}>Change Down Payment</button>
                        <div className='sort-wrapper'>
                            <button ref={sortRef} onClick={() => setSortTogg(!sortTogg)}><i className="fa-solid fa-sort" />Sort Rooms</button>
                            {sortTogg &&
                                <div ref={sortSelectionRef} className='selections'>
                                    <h1 onClick={() => setSort(prev => ({ ...prev, type: "roomNo" }))}>{sort.type == "roomNo" && <i className="fa-solid fa-caret-right" />}Room Number</h1>
                                    <h1 onClick={() => setSort(prev => ({ ...prev, type: "rate" }))}>{sort.type == "rate" && <i className="fa-solid fa-caret-right" />}Rate</h1>
                                    <h1 onClick={() => setSort(prev => ({ ...prev, type: "max" }))}>{sort.type == "max" && <i className="fa-solid fa-caret-right" />}Max Person</h1>
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
                    </div>
                    {newRoomTypeTogg &&
                        <form onSubmit={createNewRoomType} className='add-room-type'>
                            {newRoomTypeIsLoading && <div className='loader-line'></div>}
                            <h1>New Room Type:</h1>
                            <input type='text' ref={newRoomTypeRef} value={newRoomType} onChange={e => setNewRoomType(e.target.value.toUpperCase())} placeholder='type here' />
                            <button disabled={!newRoomType || newRoomTypeIsLoading} type='submit'>Add</button>
                            <i onClick={() => setNewRoomTypeTogg(false)} className="fa-solid fa-xmark" />
                        </form>
                    }
                    {(newDownPayment || newDownPayment == "") &&
                        <form onSubmit={updateDownPayment} className='change-down-payment'>
                            {changeDownPaymentIsLoading && <div className='loader-line'></div>}
                            <h1>Change Down Payment: Percentage (1-100)</h1>
                            <input ref={newDownPaymentRef} onChange={(e) => setNewDownPayment(Math.min(e.target.value / 100, 1))} value={newDownPayment * 100 === 0 ? "" : newDownPayment * 100} type='number' placeholder='type here' />
                            <button disabled={!newDownPayment || changeDownPaymentIsLoading} type='submit'>Save</button>
                            <i onClick={() => setNewDownPayment(null)} className="fa-solid fa-xmark" />
                        </form>
                    }
                    <div className='card-and-table-togg-cont'>
                        <button onClick={() => setIsCard(true)} style={isCard ? { backgroundColor: "var(--primary)", color: "#fff" } : null}>Card</button>
                        <button onClick={() => setIsCard(false)} style={!isCard ? { backgroundColor: "var(--primary)", color: "#fff" } : null}>Table</button>
                    </div>
                    {adminSettings.roomTypes?.map((roomType, i) => (
                        <RoomTypes
                            key={i}
                            roomType={roomType}
                            rooms={rooms.filter(room => room.roomType === roomType)}
                            setRooms={setRooms}
                            adminSettings={adminSettings}
                            setAdminSettings={setAdminSettings}
                            isCard={isCard}
                        />
                    ))}
                </>
            }
        </>
    )
}
