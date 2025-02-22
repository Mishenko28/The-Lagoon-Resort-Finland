import { useEffect, useState } from "react";
import Loader2 from "../../components/Loader2";
import useAdmin from "../../hooks/useAdmin";
import axios from "axios";
import AddNewAdmin from "../../components/AddNewAdmin";

export default function Admins() {
    const { dispatch } = useAdmin()

    const [isLoading, setIsLoading] = useState(true)
    const [admins, setAdmins] = useState([])

    const [newAdminTogg, setNewAdminTogg] = useState(false)


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
                    </div>
                    <div className="admin-main">
                        <table>
                            <thead>
                                <tr>
                                    <th>No</th>
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
                                    <tr key={admin._id}>
                                        <td>{i + 1}</td>
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
                    {newAdminTogg && <AddNewAdmin setAdmins={setAdmins} setNewAdminTogg={setNewAdminTogg} />}
                </>
            }
        </>
    )
}
