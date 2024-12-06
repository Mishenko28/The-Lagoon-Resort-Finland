import { createContext, useContext, useReducer, useEffect, useState } from "react"
import axios from 'axios'

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
        const admin = localStorage.getItem('lagoonAdmin')
        admin && dispatch({ type: "LOGIN", payload: JSON.parse(admin) })
        axios.defaults.baseURL = "http://localhost:8000"
        // "https://the-lagoon-resort-finland-inc-api.onrender.com" for production
        // "http://localhost:8000" for development

        axios.defaults.headers.common['Content-Type'] = 'application/json'
        if (admin) {
            const { token } = JSON.parse(admin)
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
        }
        setIsLoading(false)
    }, [])

    useEffect(() => {
        if (state.admin) {
            const { token } = state.admin
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
        }
    }, [state.admin])

    useEffect(() => {
        if (state.failed === "jwt expired") {
            dispatch({ type: "LOGOUT" })
            dispatch({ type: "FAILED", payload: null })
        }
    }, [state.failed])

    if (isLoading) {
        return
    }

    return (
        <AdminContext.Provider value={{ state, dispatch }}>
            {children}
        </AdminContext.Provider>
    )
}
