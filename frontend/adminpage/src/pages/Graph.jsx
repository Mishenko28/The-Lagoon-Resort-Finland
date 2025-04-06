import "./../styles/graph.css"
import { BarChart } from "@mui/x-charts"
import { format } from "date-fns"
import { useEffect, useState } from "react"
import axios from "axios"
import Loader2 from "../components/Loader2"
import useAdmin from "../hooks/useAdmin"




const Graph = () => {
    const { dispatch } = useAdmin()
    const [isLoading, setIsLoading] = useState(true)

    const [revenue, setRevenue] = useState(0)
    const [totalBook, setTotalBook] = useState(0)
    const [newUsers, setNewUsers] = useState(0)
    const [recentSales, setRecentSales] = useState([])
    const [bookings, setBookings] = useState(null)

    useEffect(() => {
        fetchAllData()
    }, [])

    const fetchAllData = async () => {
        axios.get("dashboard/all")
            .then(res => {
                setRevenue(res.data.revenue)
                setTotalBook(res.data.totalBook)
                setNewUsers(res.data.newUsers)
                setRecentSales(res.data.recentSales)
                setBookings(res.data.bookings)
            })
            .catch((err) => {
                dispatch({ type: 'FAILED', payload: err.response.data.error })
                console.log(err.response.data.error)
            })
            .finally(() => setIsLoading(false))
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
                                {recentSales.map(sale => (
                                    <div className="sale" key={sale._id}>
                                        <div className="left">
                                            <img src={sale.img} />
                                            <div>
                                                <h3>{sale.name}</h3>
                                                <h4>{sale.email}</h4>
                                            </div>
                                        </div>
                                        <h5>+₱{sale.payed.toLocaleString()}</h5>
                                    </div>
                                ))}
                                {recentSales.length === 0 && <div className="sale">No recent sales</div>}
                            </div>
                        </div>
                    </div>
                </>
            }
        </div>
    )
}

export default Graph