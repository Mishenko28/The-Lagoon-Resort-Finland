import { useState, useEffect } from 'react'
import useAdmin from '../hooks/useAdmin'
import '../styles/profile.css'
import axios from 'axios'
import Loader2 from '../components/Loader2'
import useConvertBase64 from '../hooks/useConvertBase64'

export default function Profile() {
    const { state, dispatch } = useAdmin()
    const [admin, setAdmin] = useState({})
    const [base64, convertToBase64] = useConvertBase64(null)

    const [isLoading, setIsLoading] = useState(true)
    const [isEditLoading, setIsEditLoading] = useState(false)

    const [editProfile, setEditProfile] = useState(null)

    useEffect(() => {
        editProfile && setEditProfile(prev => ({ ...prev, img: base64 }))
    }, [base64])

    useEffect(() => {
        const fetchProfile = async () => {
            axios.get('admin/profile', { params: { email: state.admin.email } })
                .then(res => {
                    setAdmin(res.data.admin)
                    dispatch({ type: 'SUCCESS', paload: true })
                })
                .catch((err) => {
                    dispatch({ type: 'FAILED', payload: err.response.data.error })
                    console.log(err.response.data.error)
                })
                .finally(() => {
                    setIsLoading(false)
                })
        }

        fetchProfile()
    }, [])

    const handleEditProfile = () => {
        setEditProfile({
            _id: admin._id,
            img: admin.img,
            email: admin.email,
            name: admin.personalData.name,
            age: admin.personalData.age,
            sex: admin.personalData.sex,
            contact: admin.personalData.contact,
            role: admin.role
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (editProfile.img === ''
            || editProfile.email === ''
            || editProfile.name === ''
            || editProfile.age === ''
            || editProfile.sex === ''
            || editProfile.contact === '') {
            dispatch({ type: 'FAILED', payload: 'Please fill all fields' })
            return
        }

        setIsEditLoading(true)

        axios.patch('admin/update', editProfile)
            .then(res => {
                const admin = res.data.admin
                setAdmin(res.data.admin)
                dispatch({ type: 'LOGIN', payload: { token: state.admin.token, email: admin.email, profile: admin.img, role: admin.role } })
                dispatch({ type: 'SUCCESS', payload: true })
                setEditProfile(null)
            })
            .catch(err => {
                dispatch({ type: 'FAILED', payload: err.response.data.error })
                console.log(err)
            })
            .finally(() => {
                setIsEditLoading(false)
            })
    }

    return (
        <>
            {isLoading ?
                <Loader2 />
                :
                <div className='profile'>
                    {editProfile ?
                        <form onSubmit={handleSubmit} className='cont edit-mode'>
                            {isEditLoading && <div className='loader-line'></div>}
                            <i onClick={() => setEditProfile(null)} className="fa-solid fa-xmark" />
                            <h1>Edit Profile</h1>
                            <img src={editProfile.img} />
                            <input type="file" accept=".png, .jpeg, .jpg" onChange={(e) => convertToBase64(e.target.files[0])} />
                            <h2>
                                <span>Email: </span>
                                <input type="text" value={editProfile.email} onChange={(e) => setEditProfile(prev => ({ ...prev, email: e.target.value }))} />
                            </h2>
                            <h2>
                                <span>Name: </span>
                                <input type="text" value={editProfile.name} onChange={(e) => setEditProfile(prev => ({ ...prev, name: e.target.value }))} />
                            </h2>
                            <h2>
                                <span>Age: </span>
                                <input type="number" value={editProfile.age} onChange={(e) => setEditProfile(prev => ({ ...prev, age: e.target.value }))} />
                            </h2>
                            <h2>
                                <span>Sex: </span>
                                <select value={editProfile.sex} onChange={(e) => setEditProfile(prev => ({ ...prev, sex: e.target.value }))}>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                </select>
                            </h2>
                            <h2>
                                <span>Contact Number: </span>
                                <input type="number" value={editProfile.contact} onChange={(e) => setEditProfile(prev => ({ ...prev, contact: e.target.value }))} />
                            </h2>
                            <div className='bttns'>
                                <button disabled={isLoading} type='submit'>Save Changes</button>
                                <button onClick={() => setEditProfile(null)}>Cancel</button>
                            </div>
                        </form>
                        :
                        <>
                            <div className='cont header'>
                                <img src={admin.img} />
                                <h1>{admin.personalData.name}</h1>
                                <h2><i className="fa-solid fa-envelope" />{admin.email}</h2>
                                <button onClick={handleEditProfile}><i className="fa-solid fa-pencil" />Edit Profile</button>
                            </div>
                            <div className='cont personal'>
                                <h1>Personal Information</h1>
                                <hr />
                                <div className='info'>
                                    <h2>
                                        <span>Age: </span>
                                        <span>{admin.personalData.age}</span>
                                    </h2>
                                    <h2>
                                        <span>Sex: </span>
                                        <span>{admin.personalData.sex}</span>
                                    </h2>
                                    <h2>
                                        <span>Contact Number: </span>
                                        <span>{admin.personalData.contact}</span>
                                    </h2>
                                </div>
                            </div>
                            <div className='cont role'>
                                <h1>Role</h1>
                                <hr />
                                <div className='info'>
                                    {admin.role.map((role, index) => (
                                        <h2 key={index}>{role}</h2>
                                    ))}
                                </div>
                            </div>
                        </>
                    }
                </div>
            }

        </>
    )
}
