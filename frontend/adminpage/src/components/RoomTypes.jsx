import { useState, useRef, useEffect } from 'react'
import axios from 'axios'
import useAdmin from '../hooks/useAdmin'
import AddRoom from './AddRoom'
import EditRoom from './EditRoom'
import { motion, AnimatePresence } from 'framer-motion'

export default function RoomTypes({ roomType, rooms, setRooms, adminSettings, setAdminSettings, isCard }) {
    const { dispatch } = useAdmin()

    const [roomSettTogg, setRoomSettTogg] = useState(false)
    const settingsRef = useRef(null)

    const [confirmDeleteTogg, setConfirmDeleteTogg] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const [addRoomTogg, setAddRoomTogg] = useState(false)
    const [editRoom, setEditRoom] = useState(null)

    const [isRenaming, setIsRenaming] = useState(false)
    const [newName, setNewName] = useState('')
    const newNameRef = useRef(null)

    useEffect(() => {
        newNameRef.current && newNameRef.current.focus()
    }, [newNameRef.current])

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

    const updateRoomType = async () => {
        setIsLoading(true)

        const newRoomTypes = adminSettings.roomTypes.map(type => type === roomType ? newName : type)

        await axios.patch('/admin-settings/update', {
            roomTypes: newRoomTypes
        })
            .then((res) => {
                setAdminSettings(res.data.adminSetting)
                setRooms(prev => prev.map(room => room.roomType === roomType ? { ...room, roomType: newName } : room))
                setNewName('')
                dispatch({ type: 'SUCCESS', payload: true })
            })
            .catch((err) => {
                dispatch({ type: 'FAILED', payload: err.response.data.error })
                console.log(err.response.data.error)
            })

        setIsLoading(false)
        setIsRenaming(false)
    }

    const cancelRename = () => {
        setNewName('')
        setIsRenaming(false)
    }

    return (
        <div className='room-cont'>
            {isLoading && <div className='loader-line'></div>}
            <div className='room-type-header'>
                {isRenaming ?
                    <div className='rename-room-type'>
                        <input onKeyDown={(e) => e.key === "Enter" && updateRoomType()} placeholder={roomType} ref={newNameRef} type='text' value={newName} onChange={e => setNewName(e.target.value.toUpperCase())} />
                        <i onClick={cancelRename} className="fa-solid fa-xmark" />
                        <i onClick={updateRoomType} className="fa-solid fa-floppy-disk" />
                    </div>
                    :
                    <h1>{roomType}</h1>
                }
                <i ref={settingsRef} onClick={() => setRoomSettTogg(!roomSettTogg)} className="fa-solid fa-ellipsis" />
            </div>
            {confirmDeleteTogg ?
                <div className='room-type-delete'>
                    <h1>Are you sure you want to delete this room type?</h1>
                    <h2><i className="fa-solid fa-triangle-exclamation" />Warning: Deleting this room type will also remove all associated rooms.</h2>
                    <div className='bttns'>
                        <button disabled={isLoading} onClick={handleDelete}><i className="fa-solid fa-trash-can" />Delete</button>
                        <button onClick={() => setConfirmDeleteTogg(false)}>Cancel</button>
                    </div>
                </div>
                :
                <div className='room-type-content'>
                    {roomSettTogg &&
                        <div className='room-settings'>
                            <button onClick={() => setAddRoomTogg(true)}><i className="fa-solid fa-plus" />Add</button>
                            <button onClick={() => setIsRenaming(true)}><i className="fa-solid fa-pen-to-square" />Rename</button>
                            <button onClick={() => setConfirmDeleteTogg(true)}><i className="fa-solid fa-trash-can" />Delete</button>
                        </div>
                    }
                    <AnimatePresence mode='sync'>
                        {isCard && rooms.map(room => (
                            <motion.div
                                layout
                                initial={{ opacity: 0.5, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{ duration: 0.3 }}
                                key={room._id} onClick={() => setEditRoom(room)}
                                className='room'
                            >
                                <h1>{room.roomNo}</h1>
                                <img src={room.img} />
                                <h2>₱{room.rate}</h2>
                                <h3>Add Person: ₱{room.addFeePerPerson}</h3>
                                <h4>Max Person: {room.maxPerson}</h4>
                                <hr />
                                <h5>{room.caption}</h5>
                                {!room.active && <span>not active</span>}
                            </motion.div>
                        ))}
                    </AnimatePresence>
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
                                    <AnimatePresence mode='sync'>
                                        {rooms.map(room => (
                                            <motion.tr
                                                layout
                                                initial={{ opacity: 0.5, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.8 }}
                                                transition={{ duration: 0.3 }}
                                                key={room._id}
                                                onClick={() => setEditRoom(room)}
                                            >
                                                <td>
                                                    {room.roomNo}
                                                    {!room.active && <span>not active</span>}
                                                </td>
                                                <td><img src={room.img} /></td>
                                                <td>₱{room.rate}</td>
                                                <td>₱{room.addFeePerPerson}</td>
                                                <td>{room.maxPerson}</td>
                                                <td>{room.caption}</td>
                                            </motion.tr>
                                        ))}
                                    </AnimatePresence>
                                </tbody>
                            </table>
                        </div>
                    }
                    {rooms.length === 0 &&
                        <div className='no-room'>
                            <button onClick={() => setAddRoomTogg(true)}>Add Room Now</button>
                        </div>
                    }
                </div>
            }
            {addRoomTogg && <AddRoom roomType={roomType} setAddRoomTogg={setAddRoomTogg} setRooms={setRooms} />}
            {editRoom && <EditRoom roomType={roomType} editRoom={editRoom} setEditRoom={setEditRoom} setRooms={setRooms} />}
        </div >
    )
}
