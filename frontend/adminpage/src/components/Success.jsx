import { useEffect } from "react"
import useAdmin from "../hooks/useAdmin"

export default function Success() {
    const { state, dispatch } = useAdmin()

    useEffect(() => {
        state.success && setTimeout(() => {
            dispatch({ type: 'SUCCESS', payload: false })
        }, 2000)
    }, [state.success])

    return (
        <div className="full-cont">
            <div className="success-cont">
                <i className="fa-regular fa-circle-check" />
                <h1>Success!</h1>
                <p>Your request has been successfully processed.</p>
            </div>
        </div>
    )
}
