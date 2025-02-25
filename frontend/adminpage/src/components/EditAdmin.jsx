import axios from "axios"
import { useEffect, useRef, useState } from "react"
import useAdmin from "../hooks/useAdmin"
import useConvertBase64 from "../hooks/useConvertBase64"
import Loader2 from "./Loader2"

export default function ({ setAdmins, editAdmin, setEditAdmin }) {
    const { state, dispatch } = useAdmin()
    const [base64, convertToBase64] = useConvertBase64(editAdmin.img)
    const [isLoading, setIsLoading] = useState(false)
    const [rolesloading, setRolesLoading] = useState(true)
    const [deleteTogg, setDeleteTogg] = useState(false)

    const [roles, setRoles] = useState([])

    const [newAdmin, setNewAdmin] = useState({
        _id: editAdmin._id,
        email: editAdmin.email,
        img: base64,
        role: editAdmin.role,
        name: editAdmin.personalData.name,
        age: editAdmin.personalData.age,
        sex: editAdmin.personalData.sex,
        contact: editAdmin.personalData.contact
    })

    const [password, setPassword] = useState('')
    const passwordRef = useRef(null)

    useEffect(() => {
        deleteTogg && passwordRef.current.focus()
    }, [deleteTogg])


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
                    console.log(err)
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
            || newAdmin.name === ''
            || newAdmin.age === ''
            || newAdmin.sex === ''
            || newAdmin.contact === ''
            || newAdmin.role.length === 0) {
            dispatch({ type: 'FAILED', payload: 'Please fill all fields' })
            return
        }

        setIsLoading(true)

        axios.patch('admin/update', newAdmin)
            .then(res => {
                const admin = res.data.admin
                if (editAdmin.email === state.admin.email) {
                    dispatch({ type: 'LOGIN', payload: { token: state.admin.token, email: admin.email, profile: admin.img, role: admin.role } })
                }
                setAdmins(prev => prev.map(admin => admin._id === res.data.admin._id ? res.data.admin : admin))
                dispatch({ type: 'SUCCESS', payload: true })
                setEditAdmin(null)
            })
            .catch(err => {
                dispatch({ type: 'FAILED', payload: err.response.data.error })
                console.log(err)
            })
            .finally(() => {
                setIsLoading(false)
            })
    }

    const handleDelete = async (e) => {
        e.preventDefault()

        if (password === '') {
            dispatch({ type: 'FAILED', payload: 'please verify your password' })
            return
        }

        setIsLoading(true)

        axios.delete('admin/delete', { data: { _id: newAdmin._id, password } })
            .then(res => {
                if (res.data.admin.email === state.admin.email) {
                    dispatch({ type: 'LOGOUT' })
                    return
                }
                setAdmins(prev => prev.filter(admin => admin._id !== res.data.admin._id))
                dispatch({ type: 'SUCCESS', payload: true })
                setEditAdmin(null)
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
        <div className="full-cont">
            {deleteTogg ?
                <form onSubmit={handleDelete} className="confirm-delete-admin">
                    {isLoading && <div className='loader-line'></div>}
                    <i onClick={() => setEditAdmin(null)} className="fa-solid fa-xmark" />
                    <h2>Are you sure?</h2>
                    <h3>You are about to delete this admin:</h3>
                    <div className="info">
                        <img src={newAdmin.img} />
                        <p>Email: {newAdmin.email}</p>
                        <p>Name: {newAdmin.name}</p>
                    </div>
                    <hr />
                    <label>{state.admin.email}</label>
                    <input ref={passwordRef} value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="verify your password" />
                    <div className="bttns2">
                        <button type="submit" disabled={isLoading}><i className="fa-solid fa-trash-can" />Delete</button>
                        <button onClick={() => setDeleteTogg(false)}>Cancel</button>
                    </div>
                </form>
                :
                <form onSubmit={handleSubmit} className="admin-form">
                    {isLoading && <div className='loader-line'></div>}
                    {rolesloading ?
                        <Loader2 />
                        :
                        <>
                            <h2>Edit Admin</h2>
                            <i onClick={() => setEditAdmin(null)} className="fa-solid fa-xmark" />
                            <div className="input-group-wrapper">
                                <div className="input-group">
                                    <label>Email</label>
                                    <input type="email" value={newAdmin.email} onChange={(e) => setNewAdmin(prev => ({ ...prev, email: e.target.value }))} />
                                </div>
                                <div className="input-group">
                                    <label>Name</label>
                                    <input type="text" value={newAdmin.name} onChange={(e) => setNewAdmin(prev => ({ ...prev, name: e.target.value }))} />
                                </div>
                                <div className="input-group">
                                    <label>Sex</label>
                                    <select value={newAdmin.sex} onChange={(e) => setNewAdmin(prev => ({ ...prev, sex: e.target.value }))}>
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
                                <button type="submit" disabled={isLoading}>Save</button>
                                <button onClick={() => setEditAdmin(null)}>Cancel</button>
                                <button onClick={() => setDeleteTogg(true)}>Delete</button>
                            </div>
                        </>
                    }
                </form>
            }
        </div>
    )
}
