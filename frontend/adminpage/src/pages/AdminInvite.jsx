import axios from 'axios'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import useAdmin from '../hooks/useAdmin'
import Loader2 from '../components/Loader2'
import '../styles/admin-invite.css'
import useConvertBase64 from '../hooks/useConvertBase64'
import { useNavigate } from 'react-router-dom'


export default function AdminInvite() {
    const { dispatch } = useAdmin()
    const [base64, convertToBase64] = useConvertBase64('')
    const navigate = useNavigate()

    const [searchParams] = useSearchParams()
    const token = searchParams.get('token')

    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState('')

    const [newAdmin, setNewAdmin] = useState({
        email: '',
        password: '',
        img: base64,
        name: '',
        sex: '',
        age: '',
        contact: '',
        role: []
    })

    useEffect(() => {
        setNewAdmin(prev => ({ ...prev, img: base64 }))
    }, [base64])

    const [confirmPassword, setConfirmPassword] = useState('')

    useEffect(() => {
        const verifyToken = async () => {
            setIsLoading(true)

            axios.post('admin/verify', { token })
                .then(res => {
                    const { role, email } = res.data.invite
                    setNewAdmin(prev => ({ ...prev, role, email }))
                })
                .catch(err => {
                    setError(err.response.data.error)
                    console.log(err)
                })
                .finally(() => {
                    setIsLoading(false)
                })
        }

        verifyToken()
    }, [token])

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (newAdmin.img === ''
            || newAdmin.password === ''
            || newAdmin.name === ''
            || newAdmin.age === ''
            || newAdmin.sex === ''
            || newAdmin.contact === '') {
            dispatch({ type: 'FAILED', payload: 'Please fill all fields' })
            return
        }

        if (newAdmin.password !== confirmPassword) {
            dispatch({ type: 'FAILED', payload: 'Password did not match' })
            return
        }

        setIsLoading(true)

        axios.post('admin/add', newAdmin)
            .then(res => {
                dispatch({ type: 'SUCCESS', payload: true })
                navigate('/login')
            })
            .catch(err => {
                dispatch({ type: 'FAILED', payload: err.response.data.error })
                console.log(err)
            })
            .finally(() => {
                setIsLoading(false)
            })
    }

    return (
        <div>
            {isLoading ?
                <Loader2 />
                :
                <>
                    {error ?
                        <h1>{error}</h1>
                        :
                        <div className='full-cont'>
                            <form onSubmit={handleSubmit} className='admin-form'>
                                <h1>The Lagoon Resort Finland Inc.</h1>
                                <h2>Admin Registration</h2>
                                <div className="input-group-wrapper">
                                    <div className="input-group">
                                        <label>Email</label>
                                        <input disabled type="email" value={newAdmin.email} onChange={(e) => setNewAdmin(prev => ({ ...prev, email: e.target.value }))} />
                                    </div>
                                    <div className="input-group">
                                        <label>Password</label>
                                        <input type="password" value={newAdmin.password} onChange={(e) => setNewAdmin(prev => ({ ...prev, password: e.target.value }))} />
                                    </div>
                                    <div className="input-group">
                                        <label>Confirm Password</label>
                                        <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                                    </div>
                                    <div className="input-group">
                                        <label>Name</label>
                                        <input type="text" value={newAdmin.name} onChange={(e) => setNewAdmin(prev => ({ ...prev, name: e.target.value }))} />
                                    </div>
                                    <div className="input-group">
                                        <label>Sex</label>
                                        <select value={newAdmin.sex} onChange={(e) => setNewAdmin(prev => ({ ...prev, sex: e.target.value }))}>
                                            <option value=''>--select--</option>
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                        </select>
                                    </div>
                                    <div className="input-group">
                                        <label>Age</label>
                                        <input type="number" value={newAdmin.age} onChange={(e) => setNewAdmin(prev => ({ ...prev, age: e.target.value }))} />
                                    </div>
                                    <div className="input-group">
                                        <label>Contact Number</label>
                                        <input type="number" value={newAdmin.contact} onChange={(e) => setNewAdmin(prev => ({ ...prev, contact: e.target.value }))} />
                                    </div>
                                    <div className="input-group">
                                        <label>Profile Picture</label>
                                        <input type="file" accept=".png, .jpeg, .jpg" onChange={(e) => convertToBase64(e.target.files[0])} />
                                        {newAdmin.img && <img src={newAdmin.img} />}
                                    </div>
                                </div>
                                <div className="bttns">
                                    <button type="submit" disabled={isLoading}>Save</button>
                                </div>
                            </form>
                        </div>
                    }
                </>
            }
        </div>
    )
}
