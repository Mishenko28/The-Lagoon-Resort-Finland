import axios from 'axios'
import { useEffect, useState } from 'react'
import useAdmin from '../hooks/useAdmin'
import useConvertBase64 from '../hooks/useConvertBase64'

export default function AddAmenities({ setAmenities, setAddAmenityTogg }) {
    const [base64, convertToBase64] = useConvertBase64("")
    const { dispatch } = useAdmin()

    const [isLoading, setIsLoading] = useState(false)
    const [newAmenity, setNewAmenity] = useState({
        name: "",
        img: base64,
        rate: "",
        caption: "",
        active: false
    })

    useEffect(() => {
        setNewAmenity(prev => ({ ...prev, img: base64 }))
    }, [base64])

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (newAmenity.name.trim() === "" || newAmenity.img === "" || newAmenity.rate === "" || newAmenity.caption.trim() === "") {
            dispatch({ type: 'FAILED', payload: 'Please fill out all fields' })
            return
        }

        setIsLoading(true)

        await axios.post('amenity/add', { ...newAmenity })
            .then((res) => {
                setAmenities(prev => [...prev, res.data.amenity])
                dispatch({ type: 'SUCCESS', payload: true })
                setAddAmenityTogg(false)
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
                <h3>ADD AMENITY</h3>
                <form onSubmit={handleSubmit}>
                    <div className="room-add-input">
                        <label>Image:</label>
                        <img src={newAmenity.img} />
                        <input onChange={(e) => convertToBase64(e.target.files[0])} accept=".png, .jpeg, .jpg" type="file" />
                    </div>
                    <div className="room-add-input">
                        <label>Name:</label>
                        <input onChange={(e) => setNewAmenity(prev => ({ ...prev, name: e.target.value }))} value={newAmenity.name} type="text" />
                    </div>
                    <div className="room-add-input">
                        <label>Rate:</label>
                        <input onChange={(e) => setNewAmenity(prev => ({ ...prev, rate: e.target.value }))} value={newAmenity.rate} type="number" />
                    </div>
                    <textarea onChange={(e) => setNewAmenity(prev => ({ ...prev, caption: e.target.value }))} value={newAmenity.caption} rows={4} placeholder="caption" />
                    <div className="room-add-input">
                        <label>Set as active:</label>
                        <input onChange={(e) => setNewAmenity(prev => ({ ...prev, active: e.target.checked }))} checked={newAmenity.active} type="checkbox" />
                    </div>
                    <button disabled={isLoading} type='submit'>Add</button>
                </form>
                <i onClick={() => setAddAmenityTogg(false)} className="fa-solid fa-xmark" />
            </div>
        </div>
    )
}
