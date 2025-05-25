import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import useAdmin from "../hooks/useAdmin"
import "../styles/profile.css"
import axios from "axios"
import Loader from "../components/Loader"
import { differenceInYears } from 'date-fns'

const Profile = () => {
    const { state, dispatch } = useAdmin()
    const navigate = useNavigate()
    const book = new URLSearchParams(window.location.search).get('book')

    const [isLoading, setIsLoading] = useState(true)
    const [userDetails, setUserDetails] = useState(null)
    const [error, setError] = useState("")
    const [isEditing, setIsEditing] = useState(true)
    const [noData, setNoData] = useState(true)

    const [formData, setFormData] = useState({
        name: "",
        birthDate: "",
        sex: "",
        contact: "",
        img: "/profile.webp"
    })

    useEffect(() => {
        if (!state.user) navigate("/login")
        else fetchUserDetails()
    }, [state.user])

    const fetchUserDetails = async () => {
        axios.get('user/data', { params: { email: state.user.email } })
            .then(res => {
                setUserDetails(res.data)
                if (res.data) {
                    setIsEditing(false)
                    setNoData(false)
                }
            })
            .finally(() => setIsLoading(false))
    }

    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.readAsDataURL(file)
            reader.onload = () => {
                setFormData(prev => ({ ...prev, img: reader.result }))
                resolve(reader.result)
            }
            reader.onerror = (error) => {
                setError("Error converting image")
                reject(error)
            }
        })
    }

    const handleEditData = async (e) => {
        e.preventDefault()

        if (!formData.name || !formData.birthDate || !formData.sex || !formData.contact || !formData.img) {
            setError("Please fill all fields")
            return
        }

        setIsLoading(true)

        axios.patch('user/data', {
            email: state.user.email,
            ...formData
        })
            .then(res => {
                setUserDetails(res.data)
                dispatch({ type: 'UPDATE_IMG', payload: res.data.img })
                setIsEditing(false)
            })
            .catch(err => setError(err.response.data.error))
            .finally(() => setIsLoading(false))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!formData.name || !formData.birthDate || !formData.sex || !formData.contact) {
            setError("Please fill all fields")
            return
        }

        setIsLoading(true)

        axios.post('user/data', {
            email: state.user.email,
            ...formData
        })
            .then(res => {
                setUserDetails(res.data)
                dispatch({ type: 'UPDATE_IMG', payload: res.data.img })
                setIsEditing(false)
                setNoData(false)
                book && navigate('/booking')
            })
            .finally(() => setIsLoading(false))
    }

    const handleEdit = () => {
        setIsEditing(true)
        setFormData({
            name: userDetails.name,
            birthDate: new Date(userDetails.birthDate).toISOString().split('T')[0],
            sex: userDetails.sex,
            contact: userDetails.contact,
            img: userDetails.img
        })
    }

    return (
        <div className="profile">
            {isLoading ?
                <Loader />
                :
                <>
                    {!isEditing ?
                        <>
                            <div className="main">
                                <img src={userDetails.img} />
                                <div className="name-email">
                                    <h1>{userDetails.name}</h1>
                                    <h2>{userDetails.email}</h2>
                                    <hr />
                                    <button onClick={handleEdit}>Edit Profile</button>
                                </div>
                            </div>
                            <div className="sub">
                                <div className="info-wrapper">
                                    <p>Age:</p>
                                    <h3>{differenceInYears(new Date(), userDetails.birthDate)}</h3>
                                </div>
                                <div className="info-wrapper">
                                    <p>Sex:</p>
                                    <h3>{userDetails.sex}</h3>
                                </div>
                                <div className="info-wrapper">
                                    <p>Contact Number:</p>
                                    <h3>{userDetails.contact}</h3>
                                </div>
                            </div>
                        </>
                        :
                        <form onSubmit={noData ? handleSubmit : handleEditData} className="edit">
                            {error && <h6>{error}</h6>}
                            {book &&
                                <>
                                    <p>Please fill in all the required information to proceed with your booking.</p>
                                    <hr />
                                </>
                            }
                            <div className="info-wrapper">
                                <img src={formData.img} />
                                <input type="file" accept=".jpeg, .jpg, .png" onChange={(e) => convertToBase64(e.target.files[0])} />
                            </div>
                            <hr />
                            <div className="info-wrapper">
                                <p>Full Name:</p>
                                <input value={formData.name} onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))} type="text" />
                            </div>
                            <div className="info-wrapper">
                                <p>Birth Date:</p>
                                <input value={formData.birthDate} onChange={(e) => setFormData(prev => ({ ...prev, birthDate: e.target.value }))} type="date" />
                            </div>
                            <div className="info-wrapper">
                                <p>Sex:</p>
                                <select value={formData.sex} onChange={(e) => setFormData(prev => ({ ...prev, sex: e.target.value }))}>
                                    <option value="">--select--</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                </select>
                            </div>
                            <div className="info-wrapper">
                                <p>Contact Number:</p>
                                <input value={formData.contact} onChange={(e) => e.target.value.length > 11 ? null : setFormData(prev => ({ ...prev, contact: e.target.value }))} type="number" />
                            </div>
                            <div className="bttns">
                                {!noData && <button onClick={() => setIsEditing(false)} className="cancel">Cancel</button>}
                                <button type="submit" className="save">Save</button>
                            </div>
                        </form>
                    }
                </>
            }
        </div >
    )
}

export default Profile