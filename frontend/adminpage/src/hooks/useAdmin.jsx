import { createContext, useContext, useReducer, useEffect, useState } from "react"
import axios from 'axios'
import Loader2 from "../components/Loader2"

const AdminContext = createContext()

export default function useAdmin() {
    return useContext(AdminContext)
}

const reducer = (state, action) => {
    switch (action.type) {
        case "LOGIN":
            localStorage.setItem('lagoonAdmin', JSON.stringify(action.payload))
            return { ...state, admin: { ...action.payload } }
        case "LOGOUT":
            localStorage.removeItem('lagoonAdmin')
            return { ...state, admin: null }
        case "SUCCESS":
            return { ...state, success: action.payload }
        case "FAILED":
            return { ...state, failed: action.payload }
        default:
            return state
    }
}

export function AdminContextProvider({ children }) {
    const [state, dispatch] = useReducer(reducer, {
        admin: null,
        success: false,
        failed: null
    })

    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        let admin = JSON.parse(localStorage.getItem('lagoonAdmin'))
        axios.defaults.baseURL = import.meta.env.VITE_API_URL
        axios.defaults.headers.common['Content-Type'] = 'application/json'

        const fetchRole = async () => {
            axios.get('admin/role', { params: { email: admin.email } })
                .then(res => {
                    admin.role = res.data.role
                    admin && dispatch({ type: "LOGIN", payload: admin })
                })
                .catch(err => {
                    dispatch({ type: 'FAILED', payload: err.response.data.error })
                    console.log(err)
                })
                .finally(() => {
                    setIsLoading(false)
                })
        }

        if (admin) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${admin.token}`
            fetchRole()
        } else {
            setIsLoading(false)
            return
        }
    }, [])

    useEffect(() => {
        if (state.admin) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${state.admin.token}`
        }
    }, [state.admin])

    useEffect(() => {
        if (state.failed === "jwt expired") {
            dispatch({ type: "LOGOUT" })
        }
    }, [state.failed])

    if (isLoading) {
        return <Loader2 />
    }

    return (
        <AdminContext.Provider value={{ state, dispatch }}>
            {children}
        </AdminContext.Provider>
    )
}
