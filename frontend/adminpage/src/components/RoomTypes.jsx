import { useState, useRef, useEffect } from 'react'
import axios from 'axios'
import useAdmin from '../hooks/useAdmin'
import AddRoom from './AddRoom'
import EditRoom from './EditRoom'
import { motion, AnimatePresence } from 'framer-motion'
import RoomTypeImage from './RoomTypeImage'
import { useNavigate } from 'react-router-dom'

export default function RoomTypes({ roomType, rooms, setRooms, setRoomTypes, isCard }) {
    const { dispatch } = useAdmin()
    const navigate = useNavigate()

    const [roomSettTogg, setRoomSettTogg] = useState(false)
    const settingsRef = useRef(null)

    const [confirmDeleteTogg, setConfirmDeleteTogg] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const [addRoomTogg, setAddRoomTogg] = useState(false)
    const [editRoom, setEditRoom] = useState(null)

    const [isRenaming, setIsRenaming] = useState(false)
    const [newName, setNewName] = useState('')
    const newNameRef = useRef(null)

    const [showImage, setShowImage] = useState(false)

    const [isEditing, setIsEditing] = useState(false)
    const [newDetails, setNewDetails] = useState({})

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

        await axios.delete('/room-type/delete', { data: { _id: roomType._id } })
            .then((res) => {
                setRoomTypes(prev => prev.filter(roomType => roomType._id !== res.data.roomType._id))
                setRooms(prev => prev.filter(room => room.roomType !== roomType.name))
                dispatch({ type: 'SUCCESS', payload: true })
            })
            .catch((err) => {
                dispatch({ type: 'FAILED', payload: err.response.data.error })
            })

        setIsLoading(false)
        setConfirmDeleteTogg(false)
    }

    const updateRoomType = async () => {
        if (newName === '') {
            dispatch({ type: 'FAILED', payload: 'This can not be empty' })
            return
        }

        setIsLoading(true)

        await axios.patch('/room-type/update', {
            _id: roomType._id,
            name: newName
        })
            .then((res) => {
                setRoomTypes(prev => prev.map(roomType => roomType._id === res.data.roomType._id ? { ...roomType, name: newName } : roomType))
                setRooms(prev => prev.map(room => room.roomType === roomType.name ? { ...room, roomType: newName } : room))
                setNewName('')
                dispatch({ type: 'SUCCESS', payload: true })
                setIsRenaming(false)
            })
            .catch((err) => {
                dispatch({ type: 'FAILED', payload: err.response.data.error })
            })
            .finally(() => {
                setIsLoading(false)
            })
    }

    const updateDetails = async (e) => {
        e.preventDefault()

        if (newDetails.rate === roomType.rate && newDetails.maxPerson === roomType.maxPerson && newDetails.addFeePerPerson === roomType.addFeePerPerson) {
            setIsEditing(false)
            return
        }

        if (newDetails.rate === '' || newDetails.maxPerson === '' || newDetails.addFeePerPerson === '') {
            dispatch({ type: 'FAILED', payload: 'Please fill out all fields' })
            return
        }

        setIsLoading(true)

        await axios.patch('/room-type/update', {
            _id: roomType._id,
            rate: newDetails.rate,
            maxPerson: newDetails.maxPerson,
            addFeePerPerson: newDetails.addFeePerPerson
        })
            .then((res) => {
                setRoomTypes(prev => prev.map(roomType => roomType._id === res.data.roomType._id ? { ...roomType, rate: res.data.roomType.rate, maxPerson: res.data.roomType.maxPerson, addFeePerPerson: res.data.roomType.addFeePerPerson } : roomType))
                dispatch({ type: 'SUCCESS', payload: true })
                setIsEditing(false)
            })
            .catch((err) => {
                dispatch({ type: 'FAILED', payload: err.response.data.error })
            })
            .finally(() => {
                setIsLoading(false)
            })
    }

    const cancelRename = () => {
        setNewName('')
        setIsRenaming(false)
    }

    const handleRename = () => {
        setIsRenaming(true)
        setNewName(roomType.name)
    }

    const handleEdit = () => {
        setIsEditing(true)
        setNewDetails(roomType)
    }

    return (
        <motion.div
            layout
            initial={{ opacity: 0.5, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className='room-cont'
        >
            {isLoading && <div className='loader-line'></div>}
            <div className='room-type-header'>
                <div className='room-type-details'>
                    {isRenaming ?
                        <div className='rename-room-type'>
                            <input onKeyDown={(e) => e.key === "Enter" && updateRoomType()} ref={newNameRef} type='text' value={newName} onChange={e => setNewName(e.target.value.toUpperCase())} />
                            <i onClick={cancelRename} className="fa-solid fa-xmark" />
                            {newName !== roomType.name && <i disabled={isLoading} onClick={updateRoomType} className="fa-solid fa-floppy-disk" />}
                        </div>
                        :
                        <h1>{roomType.name} ROOMS</h1>
                    }
                    <hr />
                    {isEditing ?
                        <form onSubmit={updateDetails}>
                            <p>Rate:</p>
                            <input type='number' onChange={(e) => setNewDetails(prev => ({ ...prev, rate: e.target.value }))} value={newDetails.rate} />
                            <p>Max Person:</p>
                            <input type='number' onChange={(e) => setNewDetails(prev => ({ ...prev, maxPerson: e.target.value }))} value={newDetails.maxPerson} />
                            <p>Additional Fee:</p>
                            <input type='number' onChange={(e) => setNewDetails(prev => ({ ...prev, addFeePerPerson: e.target.value }))} value={newDetails.addFeePerPerson} />
                            <div className='bttns'>
                                <button className='cancel' type='button' onClick={() => setIsEditing(false)}>Cancel</button>
                                {<button className='submit' disabled={isLoading} type='submit'>Save</button>}
                            </div>
                        </form>
                        :
                        <>
                            <h2><span>rate: ₱</span>{roomType.rate.toLocaleString()}</h2>
                            <h2><span>max person: </span>{roomType.maxPerson}</h2>
                            <h2><span>additional person: ₱</span>{roomType.addFeePerPerson.toLocaleString()}</h2>
                        </>
                    }
                </div>
                <div className='room-type-settings'>
                    <i onClick={() => setShowImage(true)} className="fa-solid fa-image" />
                    <i ref={settingsRef} onClick={() => setRoomSettTogg(!roomSettTogg)} className="fa-solid fa-gear" />
                </div>
            </div>
            {confirmDeleteTogg ?
                <div className='room-type-delete'>
                    <h1>Are you sure you want to delete this room type?</h1>
                    <h2><i className="fa-solid fa-triangle-exclamation" />Warning: Deleting this room type will also remove all associated rooms.</h2>
                    <div className='bttns'>
                        <button className='delete' disabled={isLoading} onClick={handleDelete}><i className="fa-solid fa-trash-can" />Delete</button>
                        <button className='cancel' onClick={() => setConfirmDeleteTogg(false)}>Cancel</button>
                    </div>
                </div>
                :
                <div className='room-type-content'>
                    {roomSettTogg &&
                        <div className='room-settings'>
                            <p onClick={() => setAddRoomTogg(true)}><i className="fa-solid fa-plus" />Add</p>
                            <p onClick={handleRename}><i className="fa-solid fa-pen-to-square" />Rename</p>
                            <p onClick={() => setConfirmDeleteTogg(true)}><i className="fa-solid fa-trash-can" />Delete</p>
                            <p onClick={handleEdit}><i className="fa-solid fa-pen" />Edit</p>
                            <hr />
                            <p onClick={() => navigate('/configuration/gallery#room-types')}><i className="fa-solid fa-image" />Images</p>
                        </div>
                    }
                    {isCard &&
                        <AnimatePresence mode='sync'>
                            {rooms.map(room => (
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
                                    <img src={room.img || null} />
                                    <h5>{room.caption}{!room.caption && "no caption"}</h5>
                                    {!room.active && <span>not active</span>}
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    }
                    {!isCard && rooms.length > 0 &&
                        <div className='room-table-cont'>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Room No</th>
                                        <th>Image</th>
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
                            <button className='cancel' onClick={() => setAddRoomTogg(true)}>Add Room Now</button>
                        </div>
                    }
                </div>
            }
            {showImage &&
                <RoomTypeImage setRoomTypes={setRoomTypes} setShowImage={setShowImage} roomType={roomType} />
            }
            {addRoomTogg && <AddRoom roomType={roomType} setAddRoomTogg={setAddRoomTogg} setRooms={setRooms} />}
            {editRoom && <EditRoom roomType={roomType} editRoom={editRoom} setEditRoom={setEditRoom} setRooms={setRooms} />}
        </motion.div >
    )
}
