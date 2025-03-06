import { createContext, useContext, useReducer, useEffect, useState } from "react"
import axios from 'axios'
import Loader from "../components/Loader"

const AdminContext = createContext()

export default function useAdmin() {
    return useContext(AdminContext)
}

const reducer = (state, action) => {
    switch (action.type) {
        case "LOGIN":
            localStorage.setItem('lagoonUser', JSON.stringify(action.payload))
            return { ...state, user: { ...action.payload } }
        case "LOGOUT":
            localStorage.removeItem('lagoonUser')
            return { ...state, user: null }
        default:
            return state
    }
}

export function AdminContextProvider({ children }) {
    const [state, dispatch] = useReducer(reducer, {
        user: null,
    })

    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        let user = JSON.parse(localStorage.getItem('lagoonUser'))
        axios.defaults.baseURL = import.meta.env.VITE_API_URL
        axios.defaults.headers.common['Content-Type'] = 'application/json'

        if (user) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${user.token}`
            dispatch({ type: 'LOGIN', payload: user })
        }

        setIsLoading(false)
    }, [])

    useEffect(() => {
        if (state.user) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${state.user.token}`
        }
    }, [state.user])

    if (isLoading) {
        return <Loader />
    }

    return (
        <AdminContext.Provider value={{ state, dispatch }}>
            {children}
        </AdminContext.Provider>
    )
}
