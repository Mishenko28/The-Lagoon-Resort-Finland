import '../../styles/configurations.css'
import { useEffect, useState, useRef } from 'react'
import axios from 'axios'
import useAdmin from '../../hooks/useAdmin'
import RoomTypes from '../../components/RoomTypes'

export default function Rooms() {
    const { dispatch } = useAdmin()

    const [adminSettings, setAdminSettings] = useState({})
    const [rooms, setRooms] = useState([])

    const [isLoading, setIsLoading] = useState(false)
    const [isCard, setIsCard] = useState(true)

    const [newDownPayment, setNewDownPayment] = useState(null)
    const newDownPaymentRef = useRef()

    const [newRoomTypeTogg, setNewRoomTypeTogg] = useState(false)
    const [newRoomType, setNewRoomType] = useState('')
    const newRoomTypeRef = useRef()

    useEffect(() => {
        axios.get('/admin-settings/all')
            .then((res) => {
                setAdminSettings(res.data.adminSetting)
            })
            .catch((err) => {
                dispatch({ type: 'FAILED', payload: err.response.data.error })
                console.log(err.response.data.error)
            })
        axios.get('/room/all')
            .then((res) => {
                setRooms(res.data.rooms)
            })
            .catch((err) => {
                dispatch({ type: 'FAILED', payload: err.response.data.error })
                console.log(err.response.data.error)
            })
    }, [])

    useEffect(() => {
        newRoomTypeTogg && newRoomTypeRef.current.focus()
    }, [newRoomTypeTogg])

    useEffect(() => {
        newDownPayment && newDownPaymentRef.current.focus()
    }, [newDownPayment])

    const createNewRoomType = (e) => {
        e.preventDefault()
        setIsLoading(true)

        axios.patch('/admin-settings/update', { ...adminSettings, roomTypes: [...adminSettings.roomTypes, newRoomType] })
            .then((res) => {
                setAdminSettings(res.data.adminSetting)
                dispatch({ type: 'SUCCESS', payload: true })
                setNewRoomType('')
            })
            .catch((err) => {
                dispatch({ type: 'FAILED', payload: err.response.data.error })
                console.log(err.response.data.error)
            })

        setIsLoading(false)
        setNewRoomTypeTogg(false)
    }

    const updateDownPayment = (e) => {
        e.preventDefault()
        setIsLoading(true)

        axios.patch('/admin-settings/update', { ...adminSettings, downPayment: newDownPayment })
            .then((res) => {
                setAdminSettings(res.data.adminSetting)
                dispatch({ type: 'SUCCESS', payload: true })
            })
            .catch((err) => {
                dispatch({ type: 'FAILED', payload: err.response.data.error })
                console.log(err.response.data.error)
            })

        setIsLoading(false)
        setNewDownPayment(null)
    }

    return (
        <>
            <div className="room-header">
                <button onClick={() => setNewRoomTypeTogg(true)}>Create Room Type</button>
                <button onClick={() => setNewDownPayment(adminSettings.downPayment)}>Change Down payment</button>
            </div>
            <div className='admin-settings'>
                <h1>Rooms: <b>{rooms.length}</b></h1>
                <h1>Down Payment: <b>{adminSettings.downPayment * 100}%</b></h1>
            </div>
            {newRoomTypeTogg &&
                <form onSubmit={createNewRoomType} className='add-room-type'>
                    {isLoading && <div className='loader-line'></div>}
                    <h1>New Room Type:</h1>
                    <input type='text' ref={newRoomTypeRef} value={newRoomType} onChange={e => setNewRoomType(e.target.value.toUpperCase())} placeholder='type here' />
                    <button disabled={!newRoomType || isLoading} type='submit'>Add</button>
                    <i onClick={() => setNewRoomTypeTogg(false)} className="fa-solid fa-xmark" />
                </form>
            }
            {(newDownPayment || newDownPayment == "") &&
                <form onSubmit={updateDownPayment} className='change-down-payment'>
                    <h1>Change Down Payment: Percentage (1-100)</h1>
                    <input ref={newDownPaymentRef} onChange={(e) => setNewDownPayment(Math.min(e.target.value / 100, 1))} value={newDownPayment * 100 === 0 ? "" : newDownPayment * 100} type='number' placeholder='type here' />
                    <button disabled={!newDownPayment || isLoading} type='submit'>Save</button>
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
    )
}
