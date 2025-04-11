import { useEffect, useState } from "react"
import useConvertBase64 from "../hooks/useConvertBase64"
import axios from "axios"
import useAdmin from "../hooks/useAdmin"
import { useLocation } from "react-router-dom"




const RoomTypeImage = ({ setRoomTypes, roomType, setShowImage }) => {
    const { dispatch } = useAdmin()
    const [base64, convertToBase64] = useConvertBase64(roomType.img)

    const [image, setImage] = useState(base64)
    const [caption, setCaption] = useState(roomType.caption)

    const [isEditing, setIsEditing] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        setImage(base64)
    }, [base64])

    const handleSave = async (e) => {
        e.preventDefault()

        if (caption === '') return dispatch({ type: 'FAILED', payload: 'Caption cannot be empty' })

        setIsLoading(true)

        await axios.patch('/room-type/update', {
            _id: roomType._id,
            img: image,
            caption
        })
            .then((res) => {
                setRoomTypes(prev => prev.map(roomType => roomType._id === res.data.roomType._id ? { ...roomType, img: image, caption } : roomType))
                dispatch({ type: 'SUCCESS', payload: true })
            })
            .catch((err) => {
                dispatch({ type: 'FAILED', payload: err.response.data.error })
            })
            .finally(() => {
                setIsLoading(false)
                setShowImage(false)
            })
    }

    const handleCancel = () => {
        setIsEditing(false)
        setImage(roomType.img)
        setCaption(roomType.caption)
    }

    return (
        <div className='full-cont'>
            <div className="room-type-image">
                {isLoading && <div className="loader-line"></div>}
                <i onClick={() => setShowImage(false)} className="fa-solid fa-xmark" />
                <h1>{roomType.name} ROOMS</h1>
                <img src={image} />
                {isEditing && <input onChange={(e) => convertToBase64(e.target.files[0])} accept=".png, .jpeg, .jpg" type="file" />}
                {!isEditing ?
                    <p>{caption}</p>
                    :
                    <textarea onChange={(e) => setCaption(e.target.value)} rows={4}>{caption}</textarea>
                }
                <div className="bttns">
                    {isEditing ?
                        <button onClick={handleCancel}>Cancel</button>
                        :
                        <button onClick={() => setIsEditing(true)}>Edit</button>
                    }
                    {(isEditing && roomType.img !== image || roomType.caption !== caption) && <button disabled={isLoading} onClick={handleSave}>Save</button>}
                    {!isEditing && <button onClick={() => setShowImage(false)}>Close</button>}
                </div>
            </div>
        </div>
    )
}

export default RoomTypeImage