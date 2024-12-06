import { useEffect } from "react"
import useAdmin from "../hooks/useAdmin"

export default function Success() {
    const { state, dispatch } = useAdmin()

    useEffect(() => {
        state.success && setTimeout(() => {
            dispatch({ type: 'SUCCESS', payload: false })
        }, 1500)
    }, [state.success])

    return (
        <div className="full-cont">
            <div className="success-cont animate__animated animate__bounceIn">
                <i className="fa-regular fa-circle-check" />
                <h1>Success!</h1>
                <p>Your request has been successfully processed.</p>
            </div>
        </div>
    )
}
