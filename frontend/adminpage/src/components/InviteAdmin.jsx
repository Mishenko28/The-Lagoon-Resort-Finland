import { useState, useRef, useEffect } from "react"
import useAdmin from "../hooks/useAdmin"
import axios from "axios"
import Loader2 from "./Loader2"

export default function InviteAdmin({ setInvites, setInviteNewAdmin }) {
    const { dispatch } = useAdmin()

    const [newAdmin, setNewAdmin] = useState({
        email: '',
        role: [],
    })
    const [roles, setRoles] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [rolesloading, setRolesLoading] = useState(true)
    const emailRef = useRef(null)

    useEffect(() => {
        !rolesloading && emailRef.current.focus()
    }, [rolesloading])

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

    const handleSend = async (e) => {
        e.preventDefault()

        if (newAdmin.role.length <= 0) {
            dispatch({ type: 'FAILED', payload: 'Please give a role at least one' })
            return
        }

        setIsLoading(true)

        axios.post('admin/invite', { email: newAdmin.email, role: newAdmin.role })
            .then(res => {
                setInvites(prev => [...prev, res.data.invite])
                setInviteNewAdmin(false)
                dispatch({ type: 'SUCCESS', payload: true })
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
            <form onSubmit={handleSend} className="invite-options">
                {rolesloading ?
                    <Loader2 />
                    :
                    <>
                        {isLoading && <div className="loader-line"></div>}
                        <i onClick={() => setInviteNewAdmin(false)} className="fa-solid fa-xmark" />
                        <h1>Create Admin Invitation</h1>
                        <h2>Email</h2>
                        <input ref={emailRef} onChange={(e) => setNewAdmin(prev => ({ ...prev, email: e.target.value }))} value={newAdmin.email} type="email" />
                        <h2>Role</h2>
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
                        <div className="bttns">
                            <button className="submit" disabled={isLoading} type="submit">Send</button>
                            <button className="cancel" onClick={() => setInviteNewAdmin(false)}>Cancel</button>
                        </div>
                    </>
                }
            </form>
        </div>
    )
}
