import axios from "axios"
import { useEffect, useState } from "react"
import useAdmin from "../hooks/useAdmin"
import useConvertBase64 from "../hooks/useConvertBase64"
import Loader2 from "./Loader2"

export default function AddNewAdmin({ setAdmins, setNewAdminTogg }) {
    const { dispatch } = useAdmin()
    const [base64, convertToBase64] = useConvertBase64('')
    const [isLoading, setIsLoading] = useState(false)
    const [rolesloading, setRolesLoading] = useState(true)

    const [roles, setRoles] = useState([])

    const [newAdmin, setNewAdmin] = useState({
        email: '',
        password: '',
        img: base64,
        role: [],
        name: '',
        birthDate: '',
        sex: '',
        contact: ''
    })

    const [confirmPassword, setConfirmPassword] = useState('')


    useEffect(() => {
        setNewAdmin(prev => ({ ...prev, img: base64 }))
    }, [base64])

    useEffect(() => {
        const getRoles = async () => {
            setRolesLoading(true)
            axios.get('admin/roles')
                .then(res => {
                    setRoles(res.data.Roles)
                })
                .catch(err => {
                    dispatch({ type: 'FAILED', payload: err.response.data.error })
                })
                .finally(() => {
                    setRolesLoading(false)
                })
        }

        getRoles()
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (newAdmin.img === ''
            || newAdmin.email === ''
            || newAdmin.password === ''
            || newAdmin.name === ''
            || newAdmin.birthDate === ''
            || newAdmin.sex === ''
            || newAdmin.contact === ''
            || newAdmin.role.length === 0) {
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
                setAdmins(prev => ([...prev, res.data.admin]))
                setNewAdminTogg(false)
            })
            .catch(err => {
                dispatch({ type: 'FAILED', payload: err.response.data.error })
            })
            .finally(() => {
                setIsLoading(false)
            })
    }

    return (
        <div className="full-cont">
            <form onSubmit={handleSubmit} className="admin-form">
                {isLoading && <div className='loader-line'></div>}
                {rolesloading ?
                    <Loader2 />
                    :
                    <>
                        <h2>Add New Admin</h2>
                        <i onClick={() => setNewAdminTogg(false)} className="fa-solid fa-xmark" />
                        <div className="input-group-wrapper">
                            <div className="input-group">
                                <label>Email</label>
                                <input type="email" value={newAdmin.email} onChange={(e) => setNewAdmin(prev => ({ ...prev, email: e.target.value }))} />
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
                                <label>Birth Date</label>
                                <input type="date" value={newAdmin.birthDate} onChange={(e) => setNewAdmin(prev => ({ ...prev, birthDate: e.target.value }))} />
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
                            <div className="input-group">
                                <label>Role</label>
                                <div className="roles-wrapper">
                                    {roles.map((role, i) => (
                                        <div className="roles" key={i}>
                                            <div className="roles-header">
                                                <h1>{role.page}</h1>
                                                <input checked={role.section.every(section => newAdmin.role.includes(section))} type="checkbox" onChange={(e) => e.target.checked ? role.section.map(section => !newAdmin.role.includes(section) && setNewAdmin(prev => ({ ...prev, role: [...prev.role, section] }))) : role.section.map(section => setNewAdmin(prev => ({ ...prev, role: prev.role.filter(element => element !== section) })))} />
                                            </div>
                                            {role.section.map((section, j) => (
                                                <div className="role" key={j}>
                                                    <label>{section}</label>
                                                    <input type="checkbox" checked={newAdmin.role.includes(section)} onChange={(e) => setNewAdmin(prev => e.target.checked ? ({ ...prev, role: [...prev.role, section] }) : ({ ...prev, role: prev.role.filter(role => role !== section) }))} />
                                                </div>
                                            ))}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="bttns">
                            <button className="submit" type="submit" disabled={isLoading}>Save</button>
                            <button className="cancel" onClick={() => setNewAdminTogg(false)}>Cancel</button>
                        </div>
                    </>
                }
            </form>
        </div>
    )
}
