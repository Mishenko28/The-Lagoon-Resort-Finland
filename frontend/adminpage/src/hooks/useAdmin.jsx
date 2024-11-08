import { createContext, useContext, useReducer, useEffect } from "react"

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
        default:
            return state
    }
}

export function AdminContextProvider({ children }) {
    const [state, dispatch] = useReducer(reducer, {
        admin: null,
        uri: "http://localhost:8000"
    })

    useEffect(() => {
        const admin = localStorage.getItem('lagoonAdmin')
        admin && dispatch({ type: "LOGIN", payload: JSON.parse(admin) })
    }, [])


    return (
        <AdminContext.Provider value={{ state, dispatch }}>
            {children}
        </AdminContext.Provider>
    );
}
