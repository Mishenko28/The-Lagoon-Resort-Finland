import { useState } from "react"
import "../styles/myBookings.css"
import Pending from "../components/Pending"
import Loader from "../components/Loader"



const MyBookings = () => {
    const [page, setPage] = useState("pending")
    const [isLoading, setIsLoading] = useState(false)

    const applyStyle = (nav) => {
        if (page === nav) return { color: "var(--primary)" }
        else return null
    }

    return (
        <div className="my-booking">
            {isLoading ?
                <Loader />
                :
                <>
                    <div className="navs-wrapper">
                        <div onClick={() => setPage("pending")} className="navs">
                            <i style={applyStyle("pending")} className="fa-solid fa-hourglass-half" />
                            <p style={applyStyle("pending")} >Pending</p>
                        </div>
                        <div onClick={() => setPage("confirm")} className="navs">
                            <i style={applyStyle("confirm")} className="fa-solid fa-calendar-check" />
                            <p style={applyStyle("confirm")} >Confirmed</p>
                        </div>
                        <div onClick={() => setPage("ongoing")} className="navs">
                            <i style={applyStyle("ongoing")} className="fa-solid fa-house-chimney-user" />
                            <p style={applyStyle("ongoing")} >Ongoing</p>
                        </div>
                        <div onClick={() => setPage("complete")} className="navs">
                            <i style={applyStyle("complete")} className="fa-solid fa-check" />
                            <p style={applyStyle("complete")}>Completed</p>
                        </div>
                        <div onClick={() => setPage("cancel")} className="navs">
                            <i style={applyStyle("cancel")} className="fa-solid fa-xmark" />
                            <p style={applyStyle("cancel")}>Cancelled</p>
                        </div>
                    </div>
                    {page === "pending" && <Pending />}
                </>
            }
        </div>
    )
}

export default MyBookings