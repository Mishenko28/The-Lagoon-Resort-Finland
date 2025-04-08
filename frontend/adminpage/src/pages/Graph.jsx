import "./../styles/graph.css"
import { BarChart } from "@mui/x-charts"
import { format } from "date-fns"
import { useEffect, useState } from "react"
import axios from "axios"
import Loader2 from "../components/Loader2"
import useAdmin from "../hooks/useAdmin"
import { motion, AnimatePresence } from "framer-motion"




const Graph = () => {
    const { dispatch } = useAdmin()
    const [isLoading, setIsLoading] = useState(true)

    const [revenue, setRevenue] = useState(0)
    const [totalBook, setTotalBook] = useState(0)
    const [newUsers, setNewUsers] = useState(0)
    const [recentSales, setRecentSales] = useState([])
    const [bookings, setBookings] = useState(null)
    const [feedbacks, setFeedbacks] = useState([])

    const [submitLoading, setSubmitLoading] = useState(null)

    useEffect(() => {
        fetchAllData()
    }, [])

    const fetchAllData = async () => {
        await Promise.all([
            axios.get("feedback/new")
                .then(res => setFeedbacks(res.data)),

            axios.get("dashboard/all")
                .then(res => {
                    setRevenue(res.data.revenue)
                    setTotalBook(res.data.totalBook)
                    setNewUsers(res.data.newUsers)
                    setRecentSales(res.data.recentSales)
                    setBookings(res.data.bookings)
                })
        ])
            .catch((err) => {
                dispatch({ type: 'FAILED', payload: err.response.data.error })
                console.log(err.response.data.error)
            })
            .finally(() => setIsLoading(false))
    }

    const handleApproved = async (id) => {
        setSubmitLoading({ id, status: "approve" })
        axios.post("feedback/approve", { _id: id })
            .then(res => setFeedbacks(prev => prev.filter(feedback => feedback._id !== res.data._id)))
            .catch(err => {
                dispatch({ type: 'FAILED', payload: err.response.data.error })
                console.log(err.response.data.error)
            })
            .finally(() => setSubmitLoading(null))
    }

    const handleReject = async (id) => {
        setSubmitLoading({ id, status: "reject" })
        axios.post("feedback/reject", { _id: id })
            .then(res => setFeedbacks(prev => prev.filter(feedback => feedback._id !== res.data._id)))
            .catch(err => {
                dispatch({ type: 'FAILED', payload: err.response.data.error })
                console.log(err.response.data.error)
            })
            .finally(() => setSubmitLoading(null))
    }

    return (
        <div className="graph-container">
            {isLoading ?
                <Loader2 />
                :
                <>
                    <div className="graph-header">
                        <h1>Overview</h1>
                        <h2><i className="fa-solid fa-calendar-day" /> {format(new Date(), "MMMM dd, yyyy")}</h2>
                    </div>
                    <div className="totals">
                        <div className="total-box">
                            <div className="top">
                                <h3>Total Revenue</h3>
                                <h3>₱</h3>
                            </div>
                            <h4>₱{revenue.toLocaleString()}</h4>
                        </div>
                        <div className="total-box">
                            <div className="top">
                                <h3>Total Booking</h3>
                                <h3><i className="fa-solid fa-book" /></h3>
                            </div>
                            <h4>+{totalBook}</h4>
                        </div>
                        <div className="total-box">
                            <div className="top">
                                <h3>New Users</h3>
                                <h3><i className="fa-solid fa-users" /></h3>
                            </div>
                            <h4>+{newUsers}</h4>
                        </div>
                    </div>
                    <div className="graph">
                        <div className="bar-chart">
                            <h1>Booking Bar Chart</h1>
                            {bookings &&
                                <BarChart
                                    yAxis={[{
                                        valueFormatter: (value) => value.toFixed(0),
                                        min: 0,
                                        tickMinStep: 1
                                    }]}
                                    xAxis={[{
                                        scaleType: "band",
                                        data: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
                                    }]}
                                    series={[
                                        { data: bookings.previousYear.value, label: bookings.previousYear.year.toString() },
                                        { data: bookings.currentYear.value, label: bookings.currentYear.year.toString() }
                                    ]}
                                    width={600}
                                    height={350}
                                    colors={["#4CAF50", "#2196F3"]}
                                    borderRadius={4}
                                />
                            }
                        </div>
                        <div className="recent-sales">
                            <h1>Recent Sales</h1>
                            <div className="recent-bookings-list">
                                {recentSales.map((sale, i) => (
                                    <motion.div
                                        initial={{ opacity: 0.5, scale: 0 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: (i + 1) * 0.1 }}
                                        className="sale"
                                        key={sale._id}
                                    >
                                        <div className="left">
                                            <img src={sale.img} />
                                            <div>
                                                <h3>{sale.name}</h3>
                                                <h4>{sale.email}</h4>
                                            </div>
                                        </div>
                                        <h5>+₱{sale.payed.toLocaleString()}</h5>
                                    </motion.div>
                                ))}
                                {recentSales.length === 0 && <div className="sale">No recent sales</div>}
                            </div>
                        </div>
                        {feedbacks.length > 0 &&
                            <div className="feedbacks">
                                <h1>Feedbacks</h1>
                                <div className="feedback-list">
                                    <AnimatePresence mode="sync">
                                        {feedbacks.map(feedback => (
                                            <motion.div
                                                layout
                                                initial={{ opacity: 0.5, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.8 }}
                                                transition={{ duration: 0.3 }}
                                                className="feedback"
                                                key={feedback._id}
                                            >
                                                <div className="left">
                                                    <img src={feedback.user.img} />
                                                    <div>
                                                        <h3>{feedback.user.name}</h3>
                                                        <h4>{feedback.user.email}</h4>
                                                    </div>
                                                </div>
                                                <div className="right">
                                                    <div>{Array.from({ length: 5 }, (_, i) => <i key={i} style={feedback.star > i ? { color: "var(--gold)" } : null} className="fa-solid fa-star" />)}</div>
                                                    <h5>{feedback.feedback}</h5>
                                                </div>
                                                <div className="bttns">
                                                    <button disabled={submitLoading} onClick={() => handleApproved(feedback._id)}>{(submitLoading?.id === feedback._id && submitLoading?.status === "approve") ? "Loading..." : "Approve"}</button>
                                                    <button disabled={submitLoading} onClick={() => handleReject(feedback._id)}>{(submitLoading?.id === feedback._id && submitLoading?.status === "reject") ? "Loading..." : "Reject"}</button>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>
                            </div>
                        }
                    </div>
                </>
            }
        </div>
    )
}

export default Graph