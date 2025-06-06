import axios from "axios"
import useConvertBase64 from "../hooks/useConvertBase64"
import useAdmin from "../hooks/useAdmin"
import { useState } from "react"

export default function EditRoomSubImage({ editingSubImg, setEditingSubImg, setRoomTypes }) {
    const [base64, convertToBase64] = useConvertBase64(editingSubImg.subImg[editingSubImg.index].url)
    const { dispatch } = useAdmin()

    const [isLoading, setIsLoading] = useState(false)
    const [deleteTogg, setDeleteTogg] = useState(false)

    const handleSave = async (e) => {
        e.preventDefault()

        if (!base64) {
            dispatch({ type: 'FAILED', payload: 'Please select an image' })
            return
        }

        setIsLoading(true)

        await axios.post('room-type/editSubImage', { _id: editingSubImg._id, img: base64, index: editingSubImg.index })
            .then((res) => {
                setRoomTypes(prev => prev.map(roomType => roomType._id === editingSubImg._id ? res.data.roomType : roomType))
                dispatch({ type: 'SUCCESS', payload: true })
                setEditingSubImg(null)
            })
            .catch((err) => {
                dispatch({ type: 'FAILED', payload: err.response.data.error })
            })
            .finally(() => {
                setIsLoading(false)
            })
    }

    const handleDelete = async () => {
        setIsLoading(true)

        await axios.delete('room-type/deleteSubImage', { data: { _id: editingSubImg._id, index: editingSubImg.index } })
            .then((res) => {
                setRoomTypes(prev => prev.map(roomType => roomType._id === editingSubImg._id ? res.data.roomType : roomType))
                dispatch({ type: 'SUCCESS', payload: true })
                setEditingSubImg(null)
            })
            .catch((err) => {
                dispatch({ type: 'FAILED', payload: err.response.data.error })
            })
            .finally(() => {
                setIsLoading(false)
            })
    }

    const handleCancelDelete = (e) => {
        e.preventDefault()
        setDeleteTogg(false)
    }


    return (
        <div className="full-cont">
            <form className="add-room-sub-img">
                {isLoading && <div className="loader-line"></div>}
                <h1>{editingSubImg.name} ROOMS SUB IMAGE</h1>
                {deleteTogg ?
                    <>
                        <h2>Are you sure?</h2>
                        <div className="img-cont">
                            <h3>you are about to delete this image:</h3>
                            <img src={base64} />
                        </div>

                        <div className="delete-bttns">
                            <button className="delete" disabled={isLoading} onClick={handleDelete}><i className="fa-solid fa-trash-can" />Delete</button>
                            <button className="cancel" onClick={handleCancelDelete}>Cancel</button>
                        </div>
                    </>
                    :
                    <>
                        <img src={base64} />
                        <input type="file" accept='png, jpeg, jpg' onChange={(e) => convertToBase64(e.target.files[0])} />
                        <div className="bttns">
                            <button className="submit" disabled={isLoading} type="submit" onClick={handleSave}>Save</button>
                            <button className="cancel" onClick={() => setEditingSubImg(null)}>Cancel</button>
                            <button className="delete" disabled={isLoading} onClick={() => setDeleteTogg(true)}>Delete</button>
                        </div>
                    </>
                }
                <i onClick={() => setEditingSubImg(null)} className="fa-solid fa-xmark" />
            </form>
        </div >
    )
}
