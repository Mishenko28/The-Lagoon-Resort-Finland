import { useEffect, useState } from "react";
import Loader2 from "../../components/Loader2";
import useAdmin from "../../hooks/useAdmin";
import axios from "axios";
import AddNewAdmin from "../../components/AddNewAdmin";
import EditAdmin from "../../components/EditAdmin";
import { formatDistance } from "date-fns";
import InviteOptions from "../../components/InviteOptions";
import InviteAdmin from "../../components/InviteAdmin";
import { motion, AnimatePresence } from "framer-motion";

export default function Admins() {
    const { dispatch } = useAdmin()

    const [isLoading, setIsLoading] = useState(true)

    const [admins, setAdmins] = useState([])
    const [invites, setInvites] = useState([])

    const [systemEmail, setSystemEmail] = useState(null)
    const [systemEmailIsLoading, setSystemEmailIsLoading] = useState(false)
    const [systemEmailIsOpen, setSystemEmailIsOpen] = useState(false)
    const [systemEmailIsEditing, setSystemEmailIsEditing] = useState(false)
    const [newSystemEmail, setNewSystemEmail] = useState({})

    const [newAdminTogg, setNewAdminTogg] = useState(false)
    const [editAdmin, setEditAdmin] = useState(null)
    const [inviteOptionTogg, setInviteOptionTogg] = useState(null)
    const [inviteNewAdmin, setInviteNewAdmin] = useState(false)


    useEffect(() => {
        const fetchAdmins = async () => {
            axios.get('admin/all')
                .then(res => {
                    setAdmins(res.data.admins)
                })
                .catch(err => {
                    dispatch({ type: 'FAILED', payload: err.response.data.error })
                })
                .finally(() => {
                    setIsLoading(false)
                })
        }

        const fetchInvites = async () => {
            axios.get('admin/invite')
                .then(res => {
                    setInvites(res.data.invites)
                })
                .catch(err => {
                    dispatch({ type: 'FAILED', payload: err.response.data.error })
                })
        }

        fetchInvites()
        fetchAdmins()
    }, [])

    const fetchSystemEmail = async () => {
        setSystemEmailIsLoading(true)

        axios.get("admin-settings/all")
            .then(res => setSystemEmail(res.data.adminSetting.systemEmail))
            .catch(err => {
                dispatch({ type: 'FAILED', payload: err.response.data.error })
            })
            .finally(() => setSystemEmailIsLoading(false))
    }

    const handleOpenSystemEmail = () => {
        if (!systemEmail) {
            fetchSystemEmail()
        }
        setSystemEmailIsOpen(true)
    }

    const handleCloseSystemEmail = () => {
        setSystemEmailIsOpen(false)
        setSystemEmailIsEditing(false)
        setNewSystemEmail({})
    }

    const handleIsEditing = () => {
        setSystemEmailIsEditing(true)
        setNewSystemEmail(systemEmail)
    }

    const handleUpdateSystemEmail = async (e) => {
        e.preventDefault()

        setSystemEmailIsLoading(true)
        axios.patch("admin-settings/update", { systemEmail: newSystemEmail })
            .then(res => {
                setSystemEmail(res.data.adminSetting.systemEmail)
                dispatch({ type: 'SUCCESS', payload: true })
                setSystemEmailIsEditing(false)
            })
            .catch(err => {
                dispatch({ type: 'FAILED', payload: err.response.data.error })
            })
            .finally(() => setSystemEmailIsLoading(false))
    }

    return (
        <>
            {isLoading ?
                <Loader2 />
                :
                <>
                    <div className="button-header">
                        <button onClick={() => setNewAdminTogg(true)}><i className="fa-solid fa-user-plus" />Add New Admin</button>
                        <button onClick={() => setInviteNewAdmin(true)}><i className="fa-solid fa-envelope-open-text" />Create Invite Link</button>
                        <button onClick={handleOpenSystemEmail}><i className="fa-solid fa-square-envelope" />System Email</button>
                    </div>
                    <AnimatePresence mode="sync">
                        {systemEmailIsOpen &&
                            <motion.form
                                layout
                                initial={{ opacity: 0.5 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                onSubmit={handleUpdateSystemEmail}
                                className="system-email-form"
                                key="system-email-form"
                            >
                                {systemEmailIsLoading && <div className="loader-line"></div>}
                                <div className="top-bttns">
                                    {!systemEmailIsEditing && <i onClick={handleIsEditing} className="fa-solid fa-pen-to-square" />}
                                    <i onClick={handleCloseSystemEmail} className="fa-solid fa-xmark" />
                                </div>
                                <div className="head">
                                    <h1>System Email</h1>
                                    <p>this email is used to send OTP and Invite Links</p>
                                </div>
                                {systemEmail &&
                                    <div className="body">
                                        <p>email:</p>
                                        <input onChange={e => setNewSystemEmail(prev => ({ ...prev, email: e.target.value }))} className={systemEmailIsEditing ? "edit" : ""} disabled={!systemEmailIsEditing} type="text" value={systemEmailIsEditing ? newSystemEmail.email : systemEmail.email} />
                                        <p>app password:</p>
                                        <input onChange={e => setNewSystemEmail(prev => ({ ...prev, appPassword: e.target.value }))} className={systemEmailIsEditing ? "edit" : ""} disabled={!systemEmailIsEditing} type="text" value={systemEmailIsEditing ? newSystemEmail.appPassword : systemEmail.appPassword} />
                                    </div>
                                }
                                {systemEmailIsEditing &&
                                    <div className="bttns">
                                        <button onClick={() => setSystemEmailIsEditing(false)} type="button">Cancel</button>
                                        {JSON.stringify(systemEmail) !== JSON.stringify(newSystemEmail) && <button type="submit">Save</button>}
                                    </div>
                                }
                            </motion.form>
                        }
                        <motion.div layout className="admin-main" key="admin-main-1">
                            <h1>ADMINS</h1>
                            <table>
                                <thead>
                                    <tr>
                                        <th>No.</th>
                                        <th>Picture</th>
                                        <th>Email</th>
                                        <th>Name</th>
                                        <th>Role</th>
                                        <th>Sex</th>
                                        <th>Age</th>
                                        <th>Contact</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <AnimatePresence mode="sync">
                                        {admins.map((admin, i) => (
                                            <motion.tr
                                                layout
                                                initial={{ opacity: 0.5 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                transition={{ duration: 0.3 }}
                                                key={admin._id}
                                                onClick={() => setEditAdmin(admin)}
                                            >
                                                <td>{i + 1}</td>
                                                <td><img src={admin.img} /></td>
                                                <td>{admin.email}</td>
                                                <td>{admin.personalData.name}</td>
                                                <td>
                                                    {admin.role.map((e, i) => (
                                                        <p key={i}>{e.charAt(0).toUpperCase() + e.slice(1)}</p>
                                                    ))}
                                                </td>
                                                <td>{admin.personalData.sex}</td>
                                                <td>{admin.personalData.age}</td>
                                                <td>{admin.personalData.contact}</td>
                                            </motion.tr>
                                        ))}
                                    </AnimatePresence>
                                </tbody>
                            </table>
                        </motion.div>
                        <motion.div layout className="admin-main" key="admin-main-2">
                            <h1>INVITES</h1>
                            <table>
                                <thead>
                                    <tr>
                                        <th>No.</th>
                                        <th>Email</th>
                                        <th>Role</th>
                                        <th>link</th>
                                        <th>Expired</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <AnimatePresence mode="sync">
                                        {invites.map((invite, i) => (
                                            <motion.tr
                                                layout
                                                initial={{ opacity: 0.5 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                transition={{ duration: 0.3 }}
                                                onClick={() => setInviteOptionTogg(invite)}
                                                key={invite._id}
                                            >
                                                <td>{i + 1}</td>
                                                <td>{invite.email}</td>
                                                <td>
                                                    {invite.role.map((e, i) => (
                                                        <p key={i}>{e.charAt(0).toUpperCase() + e.slice(1)}</p>
                                                    ))}
                                                </td>
                                                <td>{invite.link}</td>
                                                <td>{formatDistance(new Date(invite.createdAt).setDate(new Date(invite.createdAt).getDate() + 1), new Date(), { addSuffix: true })}</td>
                                            </motion.tr>
                                        ))}
                                    </AnimatePresence>
                                    {invites.length === 0 && <tr><td colSpan="5">No invites</td></tr>}
                                </tbody>
                            </table>
                        </motion.div>
                    </AnimatePresence>
                    {inviteNewAdmin && <InviteAdmin setInvites={setInvites} setInviteNewAdmin={setInviteNewAdmin} />}
                    {inviteOptionTogg && <InviteOptions setInvites={setInvites} inviteOptionTogg={inviteOptionTogg} setInviteOptionTogg={setInviteOptionTogg} />}
                    {editAdmin && <EditAdmin setAdmins={setAdmins} editAdmin={editAdmin} setEditAdmin={setEditAdmin} />}
                    {newAdminTogg && <AddNewAdmin setAdmins={setAdmins} setNewAdminTogg={setNewAdminTogg} />}
                </>
            }
        </>
    )
}
