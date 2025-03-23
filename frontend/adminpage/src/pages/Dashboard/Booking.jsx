import { useState } from "react"
import Pending from "./Booking/Pending"
import Confirmed from "./Booking/Confirmed"




export default function Booking() {
    const [page, setPage] = useState("pending")

    const handleClassName = (nav) => {
        if (nav === page) return "nav active"
        return "nav"
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
            {page === "pending" && <Pending />}
            {page === "confirmed" && <Confirmed />}

        </div>
    )
}
