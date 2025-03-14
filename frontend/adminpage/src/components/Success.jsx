import { useEffect } from "react"
import useAdmin from "../hooks/useAdmin"
import { motion } from 'framer-motion'

export default function Success() {
    const { state, dispatch } = useAdmin()

    useEffect(() => {
        state.success && setTimeout(() => {
            dispatch({ type: 'SUCCESS', payload: false })
        }, 1500)
    }, [state.success])

    const skip = () => {
        dispatch({ type: 'SUCCESS', payload: false })
    }

    return (
        <div onClick={skip} className="full-cont">
            <motion.div
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.1 }}
                className="success-cont"
            >
                <i className="fa-regular fa-circle-check" />
                <h1>Success!</h1>
                <p>Your request has been successfully processed.</p>
            </motion.div>
        </div>
    )
}
