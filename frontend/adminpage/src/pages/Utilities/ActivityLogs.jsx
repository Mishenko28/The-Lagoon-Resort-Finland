import useAdmin from "../../hooks/useAdmin"
import { useEffect, useState, useRef } from "react"
import axios from "axios"
import Loader2 from "../../components/Loader2"
import { format } from "date-fns"

export default function ActivityLogs() {
    const { dispatch } = useAdmin()

    const [isLoading, setIsLoading] = useState(true)
    const [logsLoading, setLogsLoading] = useState(true)
    const [logs, setLogs] = useState([])
    const [admins, setAdmins] = useState([])
    const [Actions, setActions] = useState([])

    const [page, setPage] = useState(1)
    const [filter, setFilter] = useState({
        email: 'all',
        action: 'all'
    })

    const selectedStyle = {
        backgroundColor: 'var(--gold)',
        color: 'var(--primary)'
    }

    useEffect(() => {
        setLogsLoading(true)
        const fetchLogs = async () => {
            await axios.get('log/all', {
                params: { ...filter }
            })
                .then(res => {
                    setLogs(res.data.logs)
                    setAdmins(res.data.admins)
                    setActions(res.data.actions)
                    setIsLoading(false)
                    setLogsLoading(false)
                })
                .catch(err => {
                    dispatch({ type: 'FAILED', payload: err.response.data.error })
                    console.log(err)
                })
        }

        fetchLogs()
    }, [filter])

    return (
        <>
            {isLoading ?
                <Loader2 />
                :
                <>
                    <div className="utilities-header">
                        <div className="admins">
                            <h1>Admins</h1>
                            <h2 style={filter.email === 'all' ? selectedStyle : null} onClick={() => setFilter(prev => ({ ...prev, email: 'all' }))}>All</h2>
                            {admins.map(admin => (
                                <h2 key={admin._id} style={filter.email === admin.email ? selectedStyle : null} onClick={() => setFilter(prev => ({ ...prev, email: admin.email }))}>{admin.email}</h2>
                            ))}
                        </div>
                        <div className="actions">
                            <h1>Actions</h1>
                            <h2 style={filter.action === 'all' ? selectedStyle : null} onClick={() => setFilter(prev => ({ ...prev, action: "all" }))}>All</h2>
                            {Actions.map(action => (
                                <h2 key={action} style={filter.action === action ? selectedStyle : null} onClick={() => setFilter(prev => ({ ...prev, action: action }))}>{action}</h2>
                            ))}
                        </div>
                    </div>
                    <div className="logs-table-cont">
                        <table>
                            <thead>
                                <tr>
                                    <th>Admin Name</th>
                                    <th>Activity</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            {logsLoading ?
                                <tbody>
                                    <tr><td colSpan="3">Loading...</td></tr>
                                </tbody>
                                :
                                <tbody>
                                    {logs.length === 0 && <tr><td colSpan="3">No logs found</td></tr>}
                                    {logs.map(log => (
                                        <tr key={log._id}>
                                            <td>{log.name}</td>
                                            <td>{log.activity}</td>
                                            <td>{format(new Date(log.createdAt), 'PP - h:mm a')}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            }

                        </table>
                    </div>
                </>
            }
        </>
    )
}
