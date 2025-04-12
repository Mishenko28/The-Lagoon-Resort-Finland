import axios from 'axios'
import { useEffect, useState } from 'react'
import useAdmin from '../hooks/useAdmin'
import useConvertBase64 from '../hooks/useConvertBase64'

export default function AddRoom({ roomType, setAddRoomTogg, setRooms }) {
    const { dispatch } = useAdmin()
    const [base64, convertToBase64] = useConvertBase64("")

    const [isLoading, setIsLoading] = useState(false)

    const [newRoom, setNewRoom] = useState({
        img: base64,
        roomNo: "",
        caption: "",
        active: false,
        roomType: roomType.name
    })

    useEffect(() => {
        setNewRoom(prev => ({ ...prev, img: base64 }))
    }, [base64])

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (newRoom.roomNo === "") {
            dispatch({ type: 'FAILED', payload: 'Please fill room number' })
            return
        }

        setIsLoading(true)

        await axios.post('room/add', { ...newRoom })
            .then((res) => {
                setRooms(prev => [...prev, res.data.room])
                dispatch({ type: 'SUCCESS', payload: true })
                setAddRoomTogg(false)
            })
            .catch((err) => {
                dispatch({ type: 'FAILED', payload: err.response.data.error })
            })

        setIsLoading(false)
    }

    return (
        <div className="full-cont">
            <div className="room-add">
                {isLoading && <div className='loader-line'></div>}
                <h3>ADD {roomType.name} ROOM</h3>
                <form onSubmit={handleSubmit}>
                    <div className="room-add-input">
                        <label>Image:</label>
                        <img src={newRoom.img} />
                        <input onChange={(e) => convertToBase64(e.target.files[0])} accept=".png, .jpeg, .jpg" type="file" />
                    </div>
                    <div className="room-add-input">
                        <label>Room Number:</label>
                        <input onChange={(e) => setNewRoom(prev => ({ ...prev, roomNo: e.target.value }))} value={newRoom.roomNo} type="number" />
                    </div>
                    <textarea onChange={(e) => setNewRoom(prev => ({ ...prev, caption: e.target.value }))} value={newRoom.caption} rows={4} placeholder="caption" />
                    <div className="room-add-input">
                        <label>Set as active:</label>
                        <input onChange={(e) => setNewRoom(prev => ({ ...prev, active: e.target.checked }))} checked={newRoom.active} type="checkbox" />
                    </div>
                    <button className='submit' disabled={isLoading} type='submit'>Add</button>
                </form>
                <i onClick={() => setAddRoomTogg(false)} className="fa-solid fa-xmark" />
            </div>
        </div>
    )
}
