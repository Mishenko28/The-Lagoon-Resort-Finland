import axios from "axios"
import useConvertBase64 from "../hooks/useConvertBase64"
import useAdmin from "../hooks/useAdmin"
import { useState } from "react"

export default function EditRoomMainImage({ isEditingMainImg, setIsEditingMainImg, setRoomTypes }) {
    const [base64, convertToBase64] = useConvertBase64(isEditingMainImg.img)
    const { dispatch } = useAdmin()

    const [isLoading, setIsLoading] = useState(false)

    const handleSave = async (e) => {
        e.preventDefault()

        if (!base64) {
            dispatch({ type: 'FAILED', payload: 'Please select an image' })
            return
        }

        setIsLoading(true)

        await axios.patch('room-type/update', { _id: isEditingMainImg._id, img: base64 })
            .then((res) => {
                setRoomTypes((prev) => prev.map((roomType) => roomType._id === isEditingMainImg._id ? res.data.roomType : roomType))
                dispatch({ type: 'SUCCESS', payload: true })
                setIsEditingMainImg(null)
            })
            .catch((err) => {
                dispatch({ type: 'FAILED', payload: err.response.data.error })
            })

        setIsLoading(false)
    }

    return (
        <div className="full-cont">
            <form onSubmit={handleSave} className="add-room-sub-img">
                {isLoading && <div className="loader-line"></div>}
                <h1>{isEditingMainImg.name} ROOMS MAIN IMAGE</h1>
                <img src={base64} />
                <input type="file" accept='png, jpeg, jpg' onChange={(e) => convertToBase64(e.target.files[0])} />
                <div className="bttns">
                    <button disabled={isLoading} type="submit">Save</button>
                    <button onClick={() => setIsEditingMainImg(null)}>Cancel</button>
                </div>
                <i onClick={() => setIsEditingMainImg(null)} className="fa-solid fa-xmark" />
            </form>
        </div>
    )
}
