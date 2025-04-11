import axios from "axios"
import { useState } from "react"



const Booking = () => {
    const [completed, setCompleted] = useState(0)
    const [noShow, setNoShow] = useState(0)
    const [cancelled, setCancelled] = useState(0)
    const [expired, setExpired] = useState(0)

    const [loadingPercentage, setLoadingPercentage] = useState(0)

    const handlePopulate = async (e) => {
        e.preventDefault()

        await Promise.all(
            Array.from({ length: completed }).map(async (_, i) => {
                try {
                    axios.post("/book/populate-completed")
                        .then(() => {
                            setLoadingPercentage((prev) => i == completed - 1 ? 0 : prev + (100 / completed))
                            setCompleted((prev) => prev - 1)
                        })
                        .catch(error => console.log(error))
                } catch (error) {
                    console.log(error)
                }
            })
        )

        await Promise.all(
            Array.from({ length: noShow }).map(async (_, i) => {
                try {
                    axios.post("/book/populate-no-show")
                        .then(() => {
                            setLoadingPercentage((prev) => i == noShow - 1 ? 0 : prev + (100 / noShow))
                            setNoShow((prev) => prev - 1)
                        })
                        .catch(error => console.log(error))
                } catch (error) {
                    console.log(error)
                }
            })
        )
        await Promise.all(
            Array.from({ length: cancelled }).map(async (_, i) => {
                try {
                    axios.post("/book/populate-cancelled")
                        .then(() => {
                            setLoadingPercentage((prev) => i == cancelled - 1 ? 0 : prev + (100 / cancelled))
                            setCancelled((prev) => prev - 1)
                        })
                        .catch(error => console.log(error))
                } catch (error) {
                    console.log(error)
                }
            })
        )
        await Promise.all(
            Array.from({ length: expired }).map(async (_, i) => {
                try {
                    axios.post("/book/populate-expired")
                        .then(() => {
                            setLoadingPercentage((prev) => i == expired - 1 ? 0 : prev + (100 / expired))
                            setExpired((prev) => prev - 1)
                        })
                        .catch(error => console.log(error))
                } catch (error) {
                    console.log(error)
                }
            })
        )
    }

    return (
        <div className="booking">
            <h1>POPULATE BOOKING</h1>
            <form onSubmit={handlePopulate}>
                <div className="form-group">
                    <label htmlFor="num-completed">Number of Completed:</label>
                    <input
                        id="num-completed"
                        type="number"
                        value={completed}
                        onChange={(e) => setCompleted(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="num-no-show">Number of No-Show:</label>
                    <input
                        id="num-no-show"
                        type="number"
                        value={noShow}
                        onChange={(e) => setNoShow(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="num-cancelled">Number of Cancelled:</label>
                    <input
                        id="num-cancelled"
                        type="number"
                        value={cancelled}
                        onChange={(e) => setCancelled(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="num-expired">Number of Expired:</label>
                    <input
                        id="num-expired"
                        type="number"
                        value={expired}
                        onChange={(e) => setExpired(e.target.value)}
                    />
                </div>
                <button type="submit">Populate</button>
            </form>
            {loadingPercentage > 0 &&
                <div className="loading">
                    <div className="loading-bar" style={{ width: `${loadingPercentage}%` }}></div>
                    <p>{Math.floor(loadingPercentage)}%</p>
                </div>
            }
        </div>
    )
}

export default Booking