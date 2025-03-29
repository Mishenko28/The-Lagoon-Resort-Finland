import { useState } from "react"
import Pending from "./Booking/Pending"
import Confirmed from "./Booking/Confirmed"
import Ongoing from "./Booking/Ongoing"
import Completed from "./Booking/Completed"
import Cancelled from "./Booking/Cancelled"
import Expired from "./Booking/Expired"
import NoShow from "./Booking/No-show"
import Loader2 from "../../components/Loader2"
import { useEffect } from "react"
import axios from "axios"




export default function Booking() {
    const [page, setPage] = useState("pending")
    const [isLoading, setIsLoading] = useState(true)
    const [totals, setTotals] = useState({})

    const handleClassName = (nav) => {
        if (nav === page) return "nav active"
        return "nav"
    }

    const convertToNight = (from, to) => {
        return `${Math.ceil((new Date(to) - new Date(from)) / (1000 * 60 * 60 * 24))} ${Math.ceil((new Date(to) - new Date(from)) / (1000 * 60 * 60 * 24)) === 1 ? "night" : "nights"}`
    }

    const fetchTotals = async () => {
        axios.get("book/total-book")
            .then(res => setTotals(res.data))
            .finally(() => setIsLoading(false))
    }

    useEffect(() => {
        fetchTotals()
    }, [])

    if (isLoading) return <Loader2 />

    return (
        <div className="booking">
            <div className="navs">
                <div className={handleClassName("pending")} onClick={() => setPage("pending")}>
                    Pending
                    {totals.pending > 0 && <p>{totals.pending}</p>}
                </div>
                <div className={handleClassName("confirmed")} onClick={() => setPage("confirmed")}>
                    Confirmed
                    {totals.confirmed > 0 && <p>{totals.confirmed}</p>}
                </div>
                <div className={handleClassName("ongoing")} onClick={() => setPage("ongoing")}>
                    Ongoing
                    {totals.ongoing > 0 && <p>{totals.ongoing}</p>}
                </div>
                <div className={handleClassName("completed")} onClick={() => setPage("completed")}>
                    Completed
                    {totals.completed > 0 && <p>{totals.completed}</p>}
                </div>
                <div className={handleClassName("no-show")} onClick={() => setPage("no-show")}>
                    No-Show
                    {totals.noshow > 0 && <p>{totals.noshow}</p>}
                </div>
                <div className={handleClassName("cancelled")} onClick={() => setPage("cancelled")}>
                    Cancelled
                    {totals.cancelled > 0 && <p>{totals.cancelled}</p>}
                </div>
                <div className={handleClassName("expired")} onClick={() => setPage("expired")}>
                    Expired
                    {totals.expired > 0 && <p>{totals.expired}</p>}
                </div>
            </div>
            {page === "pending" && <Pending fetchTotals={fetchTotals} convertToNight={convertToNight} />}
            {page === "confirmed" && <Confirmed fetchTotals={fetchTotals} convertToNight={convertToNight} />}
            {page === "ongoing" && <Ongoing fetchTotals={fetchTotals} convertToNight={convertToNight} />}
            {page === "completed" && <Completed convertToNight={convertToNight} />}
            {page === "no-show" && <NoShow convertToNight={convertToNight} />}
            {page === "cancelled" && <Cancelled convertToNight={convertToNight} />}
            {page === "expired" && <Expired convertToNight={convertToNight} />}
        </div>
    )
}
