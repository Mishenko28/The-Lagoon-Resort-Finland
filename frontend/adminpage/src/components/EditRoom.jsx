import axios from 'axios'
import { useEffect, useState } from 'react'
import useAdmin from '../hooks/useAdmin'
import useConvertBase64 from '../hooks/useConvertBase64'

export default function EditRoom({ editRoom, setEditRoom, setRooms }) {
    const { dispatch } = useAdmin()
    const [base64, convertToBase64] = useConvertBase64(editRoom.img)

    const [deleteTogg, setDeleteTogg] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [updatedRoom, setUpdatedRoom] = useState({
        _id: editRoom._id,
        img: base64,
        roomNo: editRoom.roomNo,
        rate: editRoom.rate,
        addFeePerPerson: editRoom.addFeePerPerson,
        maxPerson: editRoom.maxPerson,
        caption: editRoom.caption,
        active: editRoom.active,
        roomType: editRoom.roomType
    })

    useEffect(() => {
        setUpdatedRoom(prev => ({ ...prev, img: base64 }))
    }, [base64])

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (updatedRoom.img === "" || updatedRoom.roomNo === "" || updatedRoom.rate === "" || updatedRoom.addFeePerPerson === "" || updatedRoom.maxPerson === "" || updatedRoom.caption.trim() === "") {
            dispatch({ type: 'FAILED', payload: 'Please fill in all fields' })
            return
        }

        setIsLoading(true)

        await axios.patch('room/update', { ...updatedRoom })
            .then((res) => {
                setRooms(prev => prev.map(room => room._id === editRoom._id ? res.data.room : room))
                dispatch({ type: 'SUCCESS', payload: true })
                setEditRoom(null)
            })
            .catch((err) => {
                dispatch({ type: 'FAILED', payload: err.response.data.error })
                console.log(err.response.data.error)
            })

        setIsLoading(false)
    }

    const handleConfirmDelete = (e, bool) => {
        e.preventDefault()
        setDeleteTogg(bool)
    }

    const handleDelete = async (e) => {
        e.preventDefault()
        setIsLoading(true)

        await axios.delete(`room/delete`, {
            data: { _id: editRoom._id }
        })
            .then(() => {
                setRooms(prev => prev.filter(room => room._id !== editRoom._id))
                dispatch({ type: 'SUCCESS', payload: true })
                setEditRoom(null)
            })
            .catch((err) => {
                dispatch({ type: 'FAILED', payload: err.response.data.error })
                console.log(err.response.data.error)
            })

        setIsLoading(false)
    }

    return (
        <div className="full-cont">
            <div className="room-add">
                {isLoading && <div className='loader-line'></div>}
                <h3>EDIT {editRoom.roomType} ROOM</h3>
                <form onSubmit={handleSubmit}>
                    {deleteTogg ?
                        <h1>Are you sure you want to delete room number {editRoom.roomNo}?</h1>
                        :
                        <>
                            <div className="room-add-input">
                                <label>Image:</label>
                                <img src={updatedRoom.img} />
                                <input onChange={(e) => convertToBase64(e.target.files[0])} accept=".png, .jpeg, .jpg" type="file" />
                            </div>
                            <div className="room-add-input">
                                <label>Room Number:</label>
                                <input onChange={(e) => setUpdatedRoom(prev => ({ ...prev, roomNo: e.target.value }))} value={updatedRoom.roomNo} type="number" />
                            </div>
                            <div className="room-add-input">
                                <label>Rate:</label>
                                <input onChange={(e) => setUpdatedRoom(prev => ({ ...prev, rate: e.target.value }))} value={updatedRoom.rate} type="number" />
                            </div>
                            <div className="room-add-input">
                                <label>Additional Fee per Person:</label>
                                <input onChange={(e) => setUpdatedRoom(prev => ({ ...prev, addFeePerPerson: e.target.value }))} value={updatedRoom.addFeePerPerson} type="number" />
                            </div>
                            <div className="room-add-input">
                                <label>Max Person:</label>
                                <input onChange={(e) => setUpdatedRoom(prev => ({ ...prev, maxPerson: e.target.value }))} value={updatedRoom.maxPerson} type="number" />
                            </div>
                            <textarea onChange={(e) => setUpdatedRoom(prev => ({ ...prev, caption: e.target.value }))} value={updatedRoom.caption} rows={4} placeholder="caption" />
                            <div className="room-add-input">
                                <label>Set as active:</label>
                                <input onChange={(e) => setUpdatedRoom(prev => ({ ...prev, active: e.target.checked }))} checked={updatedRoom.active} type="checkbox" />
                            </div>
                        </>
                    }
                    <div className='bttns'>
                        {deleteTogg ?
                            <>
                                <button disabled={isLoading} onClick={handleDelete}>Yes</button>
                                <button disabled={isLoading} onClick={(e) => handleConfirmDelete(e, false)}>No</button>
                            </>
                            :
                            <>
                                <button disabled={isLoading} type='button' onClick={(e) => handleConfirmDelete(e, true)}>Delete</button>
                                <button disabled={isLoading} type='submit'>Save</button>
                            </>
                        }
                    </div>
                </form>
                <i onClick={() => setEditRoom(null)} className="fa-solid fa-xmark" />
            </div >
        </div >
    )
}
