import { useEffect, useState } from "react";
import Loader2 from "../../components/Loader2";
import useAdmin from "../../hooks/useAdmin";
import axios from "axios";
import AddNewAdmin from "../../components/AddNewAdmin";
import EditAdmin from "../../components/EditAdmin";
import { formatDistance } from "date-fns";
import InviteOptions from "../../components/InviteOptions";
import InviteAdmin from "../../components/InviteAdmin";

export default function Admins() {
    const { dispatch } = useAdmin()

    const [isLoading, setIsLoading] = useState(true)
    const [admins, setAdmins] = useState([])
    const [invites, setInvites] = useState([])

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
                    console.log(err)
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
                    console.log(err)
                })
        }

        fetchInvites()
        fetchAdmins()
    }, [])

    return (
        <>
            {isLoading ?
                <Loader2 />
                :
                <>
                    <div className="button-header">
                        <button onClick={() => setNewAdminTogg(true)}><i className="fa-solid fa-user-plus" />Add New Admin</button>
                        <button onClick={() => setInviteNewAdmin(true)}><i className="fa-solid fa-envelope-open-text" />Create Invite Link</button>
                    </div>
                    <div className="admin-main">
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
                                {admins.map((admin, i) => (
                                    <tr key={admin._id} onClick={() => setEditAdmin(admin)}>
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
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="admin-main">
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
                                {invites.map((invite, i) => (
                                    <tr onClick={() => setInviteOptionTogg(invite)} key={invite._id}>
                                        <td>{i + 1}</td>
                                        <td>{invite.email}</td>
                                        <td>
                                            {invite.role.map((e, i) => (
                                                <p key={i}>{e.charAt(0).toUpperCase() + e.slice(1)}</p>
                                            ))}
                                        </td>
                                        <td>{invite.link}</td>
                                        <td>{formatDistance(new Date(invite.createdAt).setDate(new Date(invite.createdAt).getDate() + 1), new Date(), { addSuffix: true })}</td>
                                    </tr>
                                ))}
                                {invites.length === 0 && <tr><td colSpan="5">No invites</td></tr>}
                            </tbody>
                        </table>
                    </div>
                    {inviteNewAdmin && <InviteAdmin setInvites={setInvites} setInviteNewAdmin={setInviteNewAdmin} />}
                    {inviteOptionTogg && <InviteOptions setInvites={setInvites} inviteOptionTogg={inviteOptionTogg} setInviteOptionTogg={setInviteOptionTogg} />}
                    {editAdmin && <EditAdmin setAdmins={setAdmins} editAdmin={editAdmin} setEditAdmin={setEditAdmin} />}
                    {newAdminTogg && <AddNewAdmin setAdmins={setAdmins} setNewAdminTogg={setNewAdminTogg} />}
                </>
            }
        </>
    )
}
