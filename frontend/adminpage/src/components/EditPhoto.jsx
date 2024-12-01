import { useEffect, useState } from 'react'
import useConvertBase64 from '../hooks/useConvertBase64'
import useAdmin from '../hooks/useAdmin'
import axios from 'axios'

export default function EditPhoto({ editPhoto, setEditPhoto, setPhotos }) {
    const { dispatch } = useAdmin()
    const [base64, convertToBase64] = useConvertBase64(editPhoto.img)

    const [deleteTogg, setDeleteTogg] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [updatePhoto, setUpdatePhoto] = useState({
        _id: editPhoto._id,
        img: base64,
        caption: editPhoto.caption,
        hide: editPhoto.hide,
    })

    useEffect(() => {
        setUpdatePhoto(prev => ({ ...prev, img: base64 }))
    }, [base64])

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (updatePhoto.img === "" || updatePhoto.caption.trim() === "") {
            dispatch({ type: 'FAILED', payload: 'Please fill in all fields' })
            return
        }

        setIsLoading(true)

        await axios.patch('gallery/update', { ...updatePhoto })
            .then((res) => {
                setPhotos(prev => prev.map(photo => photo._id === editPhoto._id ? res.data.picture : photo))
                dispatch({ type: 'SUCCESS', payload: true })
                setEditPhoto(null)
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

        await axios.delete(`gallery/delete`, {
            data: { _id: editPhoto._id }
        })
            .then(() => {
                setPhotos(prev => prev.filter(photo => photo._id !== editPhoto._id))
                dispatch({ type: 'SUCCESS', payload: true })
                setEditPhoto(null)
            })
            .catch((err) => {
                dispatch({ type: 'FAILED', payload: err.response.data.error })
                console.log(err.response.data.error)
            })

        setIsLoading(false)
    }

    return (
        <div className="full-cont" >
            <div className="room-add">
                {isLoading && <div className='loader-line'></div>}
                <h3>EDIT</h3>
                <form onSubmit={handleSubmit}>
                    {deleteTogg ?
                        <h1>Are you sure you want to delete?</h1>
                        :
                        <>
                            <div className="room-add-input">
                                <label>Image:</label>
                                <img src={updatePhoto.img} />
                                <input onChange={(e) => convertToBase64(e.target.files[0])} accept=".png, .jpeg, .jpg" type="file" />
                            </div>
                            <textarea onChange={(e) => setUpdatePhoto(prev => ({ ...prev, caption: e.target.value }))} value={updatePhoto.caption} rows={4} placeholder="caption" />
                            <div className="room-add-input">
                                <label>Hide:</label>
                                <input onChange={(e) => setUpdatePhoto(prev => ({ ...prev, hide: e.target.checked }))} checked={updatePhoto.hide} type="checkbox" />
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
                <i onClick={() => setEditPhoto(null)} className="fa-solid fa-xmark" />
            </div >
        </div >
    )
}
