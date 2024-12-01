import { useEffect, useState } from "react"
import useAdmin from "../hooks/useAdmin"

export default function Failed() {
    const { state, dispatch } = useAdmin()

    const [timer, setTimer] = useState(10)

    useEffect(() => {
        const intervalId = setInterval(() => {
            setTimer(prev => {
                if (prev <= 1) {
                    dispatch({ type: 'FAILED', payload: null })
                }
                return prev - 1
            });
        }, 1000)

        return () => clearInterval(intervalId)
    }, [state.failed])

    return (
        <div className="full-cont">
            <div className="failed-cont animate__animated animate__headShake">
                <i className="fa-regular fa-circle-xmark" />
                <h1>Failed!</h1>
                <p>{state.failed}</p>
                <h6>{timer}s</h6>
                <i onClick={() => dispatch({ type: 'FAILED', payload: null })} className="fa-solid fa-xmark" />
            </div>
        </div>
    )
}
