import { createContext, useContext, useReducer, useEffect } from "react"
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

    useEffect(() => {
        const admin = localStorage.getItem('lagoonAdmin')
        admin && dispatch({ type: "LOGIN", payload: JSON.parse(admin) })
        axios.defaults.baseURL = "http://localhost:8000"
        axios.defaults.headers.common['Content-Type'] = 'application/json'
    }, [])

    useEffect(() => {
        if (state.admin) {
            const { token } = state.admin
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
        }
    }, [state.admin])

    return (
        <AdminContext.Provider value={{ state, dispatch }}>
            {children}
        </AdminContext.Provider>
    );
}
