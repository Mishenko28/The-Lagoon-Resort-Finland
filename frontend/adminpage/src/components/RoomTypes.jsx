import { useState, useRef, useEffect } from 'react'
import axios from 'axios'
import useAdmin from '../hooks/useAdmin'
import AddRoom from './AddRoom'
import EditRoom from './EditRoom'

export default function RoomTypes({ roomType, rooms, setRooms, adminSettings, setAdminSettings, isCard }) {
    const { dispatch } = useAdmin()

    const [roomSettTogg, setRoomSettTogg] = useState(false)
    const settingsRef = useRef(null)

    const [confirmDeleteTogg, setConfirmDeleteTogg] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const [addRoomTogg, setAddRoomTogg] = useState(false)
    const [editRoom, setEditRoom] = useState(null)

    useEffect(() => {
        const handleClick = e => {
            if (settingsRef.current && !settingsRef.current.contains(e.target)) {
                setRoomSettTogg(false)
            }
        }

        document.addEventListener('click', handleClick)

        return () => {
            document.removeEventListener('click', handleClick)
        }
    }, [])

    const handleDelete = async () => {
        setIsLoading(true)

        const newRoomTypes = adminSettings.roomTypes.filter(type => type !== roomType)

        await axios.patch('/admin-settings/update', {
            ...adminSettings,
            roomTypes: newRoomTypes
        })
            .then((res) => {
                setAdminSettings(res.data.adminSetting)
                setRooms(prev => prev.filter(room => room.roomType !== roomType))
                dispatch({ type: 'SUCCESS', payload: true })
            })
            .catch((err) => {
                dispatch({ type: 'FAILED', payload: err.response.data.error })
                console.log(err.response.data.error)
            })

        setIsLoading(false)
        setConfirmDeleteTogg(false)
    }

    return (
        <div className='room-cont'>
            {isLoading && <div className='loader-line'></div>}
            <div className='room-type-header'>
                <h1>{roomType.toUpperCase()}</h1>
                <i ref={settingsRef} onClick={() => setRoomSettTogg(!roomSettTogg)} className="fa-solid fa-ellipsis" />
            </div>
            {confirmDeleteTogg ?
                <div className='room-type-delete'>
                    <h1>Are you sure you want to delete this room type?</h1>
                    <h2>Warning: Deleting this room type will also remove all associated rooms.</h2>
                    <div className='bttns'>
                        <button disabled={isLoading} onClick={handleDelete}>Yes</button>
                        <button onClick={() => setConfirmDeleteTogg(false)}>No</button>
                    </div>
                </div>
                :
                <div className='room-type-content'>
                    {roomSettTogg &&
                        <div className='room-settings'>
                            <button onClick={() => setAddRoomTogg(true)}>Add Room</button>
                            <button onClick={() => setConfirmDeleteTogg(true)}>Delete</button>
                        </div>
                    }
                    {isCard && rooms.map(room => (
                        <div key={room._id} onClick={() => setEditRoom(room)} className='room'>
                            <h1>{room.roomNo}</h1>
                            <img src={room.img} />
                            <h2>₱{room.rate}</h2>
                            <h3>Add Person: ₱{room.addFeePerPerson}</h3>
                            <h4>Max Person: {room.maxPerson}</h4>
                            <hr />
                            <h5>{room.caption}</h5>
                            {!room.active && <span>not active</span>}
                        </div>
                    ))}
                    {!isCard && rooms.length > 0 &&
                        <div className='room-table-cont'>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Room No</th>
                                        <th>Image</th>
                                        <th>Rate</th>
                                        <th>Add Person</th>
                                        <th>Max Person</th>
                                        <th>Caption</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {rooms.map(room => (
                                        <tr key={room._id} onClick={() => setEditRoom(room)}>
                                            <td>
                                                {room.roomNo}
                                                {!room.active && <span>not active</span>}
                                            </td>
                                            <td><img src={room.img} /></td>
                                            <td>₱{room.rate}</td>
                                            <td>₱{room.addFeePerPerson}</td>
                                            <td>{room.maxPerson}</td>
                                            <td>{room.caption}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    }
                    {rooms.length === 0 &&
                        <div className='no-room'>
                            <button onClick={() => setAddRoomTogg(true)}>Add Room</button>
                        </div>
                    }
                </div>
            }
            {addRoomTogg && <AddRoom roomType={roomType} setAddRoomTogg={setAddRoomTogg} setRooms={setRooms} />}
            {editRoom && <EditRoom roomType={roomType} editRoom={editRoom} setEditRoom={setEditRoom} setRooms={setRooms} />}
        </div >
    )
}
