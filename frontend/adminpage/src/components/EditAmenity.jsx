import axios from 'axios'
import { useEffect, useState } from 'react'
import useAdmin from '../hooks/useAdmin'
import useConvertBase64 from '../hooks/useConvertBase64'

export default function EditAmenity({ editAmenity, setEditAmenity, setAmenities }) {
    const { dispatch } = useAdmin()
    const [base64, convertToBase64] = useConvertBase64(editAmenity.img)

    const [deleteTogg, setDeleteTogg] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [updateAmenity, setUpdateAmenity] = useState({
        _id: editAmenity._id,
        img: base64,
        name: editAmenity.name,
        caption: editAmenity.caption,
        active: editAmenity.active,
    })

    useEffect(() => {
        setUpdateAmenity(prev => ({ ...prev, img: base64 }))
    }, [base64])



    const handleSubmit = async (e) => {
        e.preventDefault()

        if (updateAmenity.img === "" || updateAmenity.caption.trim() === "" || updateAmenity.name.trim() === "") {
            dispatch({ type: 'FAILED', payload: 'Please fill out all fields' })
            return
        }

        setIsLoading(true)

        await axios.patch('amenity/update', { ...updateAmenity })
            .then((res) => {
                setAmenities(prev => prev.map(amenity => amenity._id === editAmenity._id ? res.data.amenity : amenity))
                dispatch({ type: 'SUCCESS', payload: true })
                setEditAmenity(null)
            })
            .catch((err) => {
                dispatch({ type: 'FAILED', payload: err.response.data.error })
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

        await axios.delete(`amenity/delete`, {
            data: { _id: editAmenity._id }
        })
            .then(() => {
                setAmenities(prev => prev.filter(amenity => amenity._id !== editAmenity._id))
                dispatch({ type: 'SUCCESS', payload: true })
                setEditAmenity(null)
            })
            .catch((err) => {
                dispatch({ type: 'FAILED', payload: err.response.data.error })
            })

        setIsLoading(false)
    }

    return (
        <div className="full-cont" >
            <div className="room-add">
                {isLoading && <div className='loader-line'></div>}
                <h3>EDIT AMENITY</h3>
                <form onSubmit={handleSubmit}>
                    {deleteTogg ?
                        <h1>Are you sure you want to delete {editAmenity.name}?</h1>
                        :
                        <>
                            <div className="room-add-input">
                                <label>Image:</label>
                                <img src={updateAmenity.img} />
                                <input onChange={(e) => convertToBase64(e.target.files[0])} accept=".png, .jpeg, .jpg" type="file" />
                            </div>
                            <div className="room-add-input">
                                <label>Name:</label>
                                <input onChange={(e) => setUpdateAmenity(prev => ({ ...prev, name: e.target.value }))} value={updateAmenity.name} type="text" />
                            </div>
                            <textarea onChange={(e) => setUpdateAmenity(prev => ({ ...prev, caption: e.target.value }))} value={updateAmenity.caption} rows={4} placeholder="caption" />
                            <div className="room-add-input">
                                <label>Set as active:</label>
                                <input onChange={(e) => setUpdateAmenity(prev => ({ ...prev, active: e.target.checked }))} checked={updateAmenity.active} type="checkbox" />
                            </div>
                        </>
                    }
                    <div className='bttns'>
                        {deleteTogg ?
                            <>
                                <button className='delete' disabled={isLoading} onClick={handleDelete}>Delete</button>
                                <button className='cancel' disabled={isLoading} onClick={(e) => handleConfirmDelete(e, false)}>Cancel</button>
                            </>
                            :
                            <>
                                <button className='delete' disabled={isLoading} type='button' onClick={(e) => handleConfirmDelete(e, true)}>Delete</button>
                                <button className='submit' disabled={isLoading} type='submit'>Save</button>
                            </>
                        }
                    </div>
                </form>
                <i onClick={() => setEditAmenity(null)} className="fa-solid fa-xmark" />
            </div >
        </div >
    )
}
