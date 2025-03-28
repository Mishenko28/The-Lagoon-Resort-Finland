import { useState } from "react"
import Pending from "./Booking/Pending"
import Confirmed from "./Booking/Confirmed"
import Ongoing from "./Booking/Ongoing"
import Completed from "./Booking/Completed"
import Cancelled from "./Booking/Cancelled"
import Expired from "./Booking/Expired"
import NoShow from "./Booking/No-show"




export default function Booking() {
    const [page, setPage] = useState("pending")

    const handleClassName = (nav) => {
        if (nav === page) return "nav active"
        return "nav"
    }

    const convertToNight = (from, to) => {
        return `${Math.ceil((new Date(to) - new Date(from)) / (1000 * 60 * 60 * 24))} ${Math.ceil((new Date(to) - new Date(from)) / (1000 * 60 * 60 * 24)) === 1 ? "night" : "nights"}`
    }

    return (
        <div className="booking">
            <div className="navs">
                <div className={handleClassName("pending")} onClick={() => setPage("pending")}>Pending</div>
                <div className={handleClassName("confirmed")} onClick={() => setPage("confirmed")}>Confirmed</div>
                <div className={handleClassName("ongoing")} onClick={() => setPage("ongoing")}>Ongoing</div>
                <div className={handleClassName("completed")} onClick={() => setPage("completed")}>Completed</div>
                <div className={handleClassName("no-show")} onClick={() => setPage("no-show")}>No-Show</div>
                <div className={handleClassName("cancelled")} onClick={() => setPage("cancelled")}>Cancelled</div>
                <div className={handleClassName("expired")} onClick={() => setPage("expired")}>Expired</div>
            </div>
            {page === "pending" && <Pending convertToNight={convertToNight} />}
            {page === "confirmed" && <Confirmed convertToNight={convertToNight} />}
            {page === "ongoing" && <Ongoing convertToNight={convertToNight} />}
            {page === "completed" && <Completed convertToNight={convertToNight} />}
            {page === "no-show" && <NoShow convertToNight={convertToNight} />}
            {page === "cancelled" && <Cancelled convertToNight={convertToNight} />}
            {page === "expired" && <Expired convertToNight={convertToNight} />}
        </div>
    )
}
