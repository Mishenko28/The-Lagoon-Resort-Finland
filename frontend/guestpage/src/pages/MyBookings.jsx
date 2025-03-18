import { useEffect, useState } from "react"
import "../styles/myBookings.css"
import Pending from "../components/Pending"
import Cancelled from "../components/Cancelled"
import Loader from "../components/Loader"
import axios from "axios"
import useAdmin from "../hooks/useAdmin"
import { useNavigate } from "react-router-dom"



const MyBookings = () => {
    const { state } = useAdmin()
    const navigate = useNavigate()

    const [page, setPage] = useState("pending")
    const [isLoading, setIsLoading] = useState(true)

    const [total, setTotal] = useState(null)

    useEffect(() => {
        if (!state.user) navigate("/login")
        else totalBooks()
    }, [state.user])

    const applyStyle = (nav) => {
        if (page === nav) return { color: "var(--primary)" }
        else return null
    }

    const totalBooks = async () => {
        axios.get("book/total-book", { params: { email: state.user.email } })
            .then(res => setTotal(res.data))
            .finally(() => setIsLoading(false))
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
                            {total?.pending > 0 && <h1>{total?.pending}</h1>}
                        </div>
                        <div onClick={() => setPage("confirm")} className="navs">
                            <i style={applyStyle("confirm")} className="fa-solid fa-calendar-check" />
                            <p style={applyStyle("confirm")} >Confirmed</p>
                            {total?.confirm > 0 && <h1>{total?.confirm}</h1>}
                        </div>
                        <div onClick={() => setPage("ongoing")} className="navs">
                            <i style={applyStyle("ongoing")} className="fa-solid fa-house-chimney-user" />
                            <p style={applyStyle("ongoing")} >Ongoing</p>
                            {total?.ongoing > 0 && <h1>{total?.ongoing}</h1>}
                        </div>
                        <div onClick={() => setPage("complete")} className="navs">
                            <i style={applyStyle("complete")} className="fa-solid fa-check" />
                            <p style={applyStyle("complete")}>Completed</p>
                            {total?.complete > 0 && <h1>{total?.complete}</h1>}
                        </div>
                        <div onClick={() => setPage("cancel")} className="navs">
                            <i style={applyStyle("cancel")} className="fa-solid fa-xmark" />
                            <p style={applyStyle("cancel")}>Cancelled</p>
                            {total?.cancel > 0 && <h1>{total?.cancel}</h1>}
                        </div>
                    </div>
                    {page === "pending" && <Pending totalBooks={totalBooks} />}
                    {page === "cancel" && <Cancelled />}
                </>
            }
        </div>
    )
}

export default MyBookings