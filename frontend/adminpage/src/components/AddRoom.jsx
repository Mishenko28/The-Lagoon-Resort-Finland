import axios from 'axios'
import { useState } from 'react'
import useAdmin from '../hooks/useAdmin'

export default function AddRoom({ roomType, setAddRoomTogg, setRooms }) {
    const { dispatch } = useAdmin()

    const [isLoading, setIsLoading] = useState(false)
    const [newRoom, setNewRoom] = useState({
        img: "",
        roomNo: "",
        rate: "",
        addFeePerPerson: "",
        maxPerson: "",
        caption: "",
        active: false,
        roomType: roomType
    })

    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader()

            reader.onloadend = () => {
                resolve(reader.result)
            }

            reader.onerror = () => {
                reject(new Error('Failed to convert image to Base64'))
            }

            reader.readAsDataURL(file)
        })
    }

    const handleChangeImage = (file) => {
        if (file) {
            convertToBase64(file)
                .then(base64 => setNewRoom(prev => ({ ...prev, img: base64 })))
        } else {
            setNewRoom(prev => ({ ...prev, img: "" }))
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        if (newRoom.img === "" || newRoom.roomNo === "" || newRoom.rate === "" || newRoom.addFeePerPerson === "" || newRoom.maxPerson === "" || newRoom.caption.trim() === "") {
            alert('Please fill out all fields')
            return
        }

        setIsLoading(true)

        axios.post('room/add', { ...newRoom })
            .then((res) => {
                setRooms(prev => [...prev, res.data.room])
                dispatch({ type: 'SUCCESS', payload: true })
                setAddRoomTogg(false)
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
                <h3>ADD {roomType} ROOM</h3>
                <form onSubmit={handleSubmit}>
                    <div className="room-add-input">
                        <label>Image:</label>
                        <img src={newRoom.img} />
                        <input onChange={(e) => handleChangeImage(e.target.files[0])} accept=".png, .jpeg, .jpg" type="file" />
                    </div>
                    <div className="room-add-input">
                        <label>Room Number:</label>
                        <input onChange={(e) => setNewRoom(prev => ({ ...prev, roomNo: e.target.value }))} value={newRoom.roomNo} type="number" />
                    </div>
                    <div className="room-add-input">
                        <label>Rate:</label>
                        <input onChange={(e) => setNewRoom(prev => ({ ...prev, rate: e.target.value }))} value={newRoom.rate} type="number" />
                    </div>
                    <div className="room-add-input">
                        <label>Additional Fee per Person:</label>
                        <input onChange={(e) => setNewRoom(prev => ({ ...prev, addFeePerPerson: e.target.value }))} value={newRoom.addFeePerPerson} type="number" />
                    </div>
                    <div className="room-add-input">
                        <label>Max Person:</label>
                        <input onChange={(e) => setNewRoom(prev => ({ ...prev, maxPerson: e.target.value }))} value={newRoom.maxPerson} type="number" />
                    </div>
                    <textarea onChange={(e) => setNewRoom(prev => ({ ...prev, caption: e.target.value }))} value={newRoom.caption} rows={4} placeholder="caption" />
                    <div className="room-add-input">
                        <label>Set as active:</label>
                        <input onChange={(e) => setNewRoom(prev => ({ ...prev, active: e.target.checked }))} checked={newRoom.active} type="checkbox" />
                    </div>
                    <button disabled={isLoading} type='submit'>Add</button>
                </form>
                <i onClick={() => setAddRoomTogg(false)} className="fa-solid fa-xmark" />
            </div>
        </div>
    )
}
