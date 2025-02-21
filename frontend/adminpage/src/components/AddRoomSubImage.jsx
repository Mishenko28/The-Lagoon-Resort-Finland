import axios from "axios"
import useConvertBase64 from "../hooks/useConvertBase64"
import useAdmin from "../hooks/useAdmin"
import { useState } from "react"

export default function AddRoomSubImage({ isAddingSubImg, setIsAddingSubImg, setRooms }) {
    const [base64, convertToBase64] = useConvertBase64("")
    const { dispatch } = useAdmin()

    const [isLoading, setIsLoading] = useState(false)

    const handleSave = async (e) => {
        e.preventDefault()

        if (base64 === "") {
            dispatch({ type: 'FAILED', payload: 'Please select an image' })
            return
        }

        setIsLoading(true)

        await axios.post('room/addSubImage', { _id: isAddingSubImg._id, img: base64 })
            .then((res) => {
                setIsAddingSubImg(null)
                setRooms(prev => prev.map(room => room._id === isAddingSubImg._id ? res.data.room : room))
                dispatch({ type: 'SUCCESS', payload: true })
            })
            .catch((err) => {
                dispatch({ type: 'FAILED', payload: err.response.data.error })
                console.log(err.response.data.error)
            })
            .finally(() => {
                setIsLoading(false)
            })
    }

    return (
        <div className="full-cont">
            <form onSubmit={handleSave} className="add-room-sub-img">
                {isLoading && <div className="loader-line"></div>}
                <h1>{isAddingSubImg.roomType} Room {isAddingSubImg.roomNo}</h1>
                <img src={base64} />
                <input type="file" accept='png, jpeg, jpg' onChange={(e) => convertToBase64(e.target.files[0])} />
                <div className="bttns">
                    <button disabled={isLoading} type="submit">Save</button>
                    <button onClick={() => setIsAddingSubImg(null)}>Cancel</button>
                </div>
                <i onClick={() => setIsAddingSubImg(null)} className="fa-solid fa-xmark" />
            </form>
        </div>
    )
}
