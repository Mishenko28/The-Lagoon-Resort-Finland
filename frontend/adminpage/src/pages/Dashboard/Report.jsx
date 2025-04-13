// PDF
import pdfMake from 'pdfmake/build/pdfmake'
import pdfFonts from 'pdfmake/build/vfs_fonts'
pdfMake.vfs = pdfFonts.pdfMake ? pdfFonts.pdfMake.vfs : pdfFonts.vfs
// PDF

import axios from 'axios'
import { useState } from 'react'
import DatePicker from 'react-datepicker'
import useAdmin from '../../hooks/useAdmin'
import Loader2 from '../../components/Loader2'
import { format, startOfWeek, endOfWeek } from 'date-fns'


const Report = () => {
    const { state, dispatch } = useAdmin()
    const [isLoading, setIsLoading] = useState(false)

    const [report, setReport] = useState("")

    const [day, setDay] = useState(new Date())
    const [week, setWeek] = useState(new Date())
    const [month, setMonth] = useState(new Date())
    const [year, setYear] = useState(new Date())

    const weekRange = (date) => {
        const start = startOfWeek(date, { weekStartsOn: 0 })
        const end = endOfWeek(date, { weekStartsOn: 0 })

        return { start, end }
    }

    const generateReport = async () => {
        setIsLoading(true)

        switch (report) {
            case "daily":
                const tomottow = new Date(day)
                tomottow.setDate(tomottow.getDate() + 1)

                let newBooksTotal
                let revenue
                let checkIn
                let checkOut
                let roomAvailability
                let totalPerStatus
                let payments

                await Promise.all([
                    axios.post("room-type/available-rooms", { from: day, to: tomottow })
                        .then(res => roomAvailability = res.data),

                    axios.get("report/daily", { params: { day } })
                        .then(res => {
                            newBooksTotal = res.data.newBooksTotal
                            revenue = res.data.revenue
                            checkIn = res.data.checkIn
                            checkOut = res.data.checkOut
                            totalPerStatus = res.data.totalPerStatus
                            payments = res.data.payments
                        })
                ])
                    .catch((err) => {
                        dispatch({ type: 'FAILED', payload: err.response.data.error })
                    })
                    .finally(() => setIsLoading(false))

                generatePDF({
                    date: new Date(day).toLocaleDateString(),
                    newBooksTotal,
                    revenue,
                    checkIn,
                    checkOut,
                    roomAvailability,
                    totalPerStatus,
                    payments
                })
                break

            case "weekly":
                const { start, end } = weekRange(week)

                axios.get("report/weekly", { params: { start, end } })
                    .then(res => {
                        generatePDF({
                            date: `${format(start, "M/d/yyyy")} - ${format(end, "M/d/yyyy")}`,
                            totalBookings: res.data.totalBookings,
                            revenue: res.data.revenue,
                            totalPerStatus: res.data.totalPerStatus,
                            payments: res.data.payments
                        })
                    })
                    .catch((err) => {
                        dispatch({ type: 'FAILED', payload: err.response.data.error })
                    })
                    .finally(() => setIsLoading(false))
                break

            case "monthly":
                axios.get("report/monthly", { params: { month } })
                    .then(res => {
                        generatePDF({
                            date: format(month, "MMMM yyyy"),
                            totalBookings: res.data.totalBookings,
                            revenue: res.data.revenue,
                            totalPerStatus: res.data.totalPerStatus,
                            payments: res.data.payments
                        })
                    })
                    .catch((err) => {
                        dispatch({ type: 'FAILED', payload: err.response.data.error })
                    })
                    .finally(() => setIsLoading(false))
                break

            case "yearly":
                axios.get("report/yearly", { params: { year } })
                    .then(res => {
                        generatePDF({
                            date: format(year, "yyyy"),
                            totalBookings: res.data.totalBookings,
                            revenue: res.data.revenue,
                            totalPerStatus: res.data.totalPerStatus,
                            payments: res.data.payments
                        })
                    })
                    .catch((err) => {
                        dispatch({ type: 'FAILED', payload: err.response.data.error })
                    })
                    .finally(() => setIsLoading(false))
                break

        }
    }


    const generatePDF = ({
        date = new Date().toLocaleDateString(),
        newBooksTotal = 0,
        totalBookings = 0,
        revenue = 0,
        checkIn = [],
        checkOut = [],
        roomAvailability = [],
        totalPerStatus = [],
        payments = []
    }) => {
        /** @type {import('pdfmake/interfaces').TDocumentDefinitions} */

        const bookTable = (books) => {
            let table = books.map((book, i) => {
                return [
                    { text: i + 1, fontSize: 10 },
                    { text: book.user.details.name, fontSize: 10 },
                    { text: book.user.details.sex, fontSize: 10, position: "some value" },
                    { text: book.user.details.age, fontSize: 10 },
                    { text: book.user.details.contact, fontSize: 10 },
                    { text: book.room.map(r => `${r.roomType} R${r.roomNo}`).join(", "), fontSize: 10 },
                    { text: book.payed.toLocaleString(), fontSize: 10, alignment: "right" },
                    { text: book.total.toLocaleString(), fontSize: 10, alignment: "right" },
                    { text: book.balance.toLocaleString(), fontSize: 10, alignment: "right" }
                ]
            })

            if (books.length === 0) {
                table.push(
                    [
                        { text: "No data", colSpan: 9, alignment: 'center', fontSize: 10 }, "", "", "", "", "", "", "", ""
                    ]
                )
            }

            return table
        }

        const roomAvailabilityTable = (roomAvailability) => {
            let table = []
            roomAvailability.forEach(room => {

                room.rooms.map((r, i) => {
                    if (i === 0) {
                        table.push(
                            [
                                { text: room.roomType, rowSpan: room.rooms.length },
                                { text: `R${r.roomNo}`, fontSize: 10, margin: [0, 0, 0, 0] },
                                { text: r.available ? "Available" : "Occupied", fontSize: 10, margin: [0, 0, 0, 0], alignment: "center", background: r.available ? "#0f0" : "#f00", padding: 10 }
                            ]
                        )
                    } else {
                        table.push([
                            "", { text: `R${r.roomNo}`, fontSize: 10, margin: [0, 0, 0, 0] },
                            { text: r.available ? "Available" : "Occupied", fontSize: 10, margin: [0, 0, 0, 0], alignment: "center", background: r.available ? "#0f0" : "#f00" }
                        ])
                    }
                })
            })

            return table
        }

        const statusTable = (totalPerStatus) => {
            let table = totalPerStatus.map(status => {
                return [
                    { text: status.status, fontSize: 10, },
                    { text: status.totalBooks.toLocaleString(), fontSize: 10, alignment: "center" },
                    { text: status.totalAmount.toLocaleString(), fontSize: 10, alignment: "right" }
                ]
            })

            return table
        }

        const dailyPaymentTable = (payments) => {
            let table = payments.map((payment, i) => {
                return [
                    { text: i + 1, fontSize: 10, alignment: "center" },
                    { text: payment.userId.details.name, fontSize: 10 },
                    { text: parseInt(payment.amount).toLocaleString(), fontSize: 10, alignment: "right" }
                ]
            })

            return table
        }

        const docDefinition = {
            pageSize: 'A4',
            pageMargins: [40, 80, 40, 60],
            header: { text: 'THE LAGOON RESORT FINLAND INC. GENERAL REPORT', margin: [0, 30], alignment: 'center', fontSize: 18, bold: true },
            content: [
                {
                    columnGap: 30,
                    columns: [
                        [
                            {
                                columns: [
                                    { text: "Report: ", fontSize: 10, bold: true, width: "auto" },
                                    { text: report, fontSize: 10, alignment: "right" }
                                ], marginBottom: 5
                            },
                            {
                                columns: [
                                    { text: "Reporting Date: ", fontSize: 10, bold: true, width: "auto" },
                                    { text: date, fontSize: 10, alignment: "right" }
                                ], marginBottom: 5
                            },
                            {
                                columns: [
                                    { text: "Revenue: ", fontSize: 10, bold: true, width: "auto" },
                                    { text: "₱" + revenue.toLocaleString(), fontSize: 10, alignment: "right" }
                                ], marginBottom: 5
                            }
                        ],
                        [
                            {
                                columns: [
                                    { text: "Prepared by: ", fontSize: 10, bold: true, width: "auto" },
                                    { text: state.admin.email, fontSize: 10, alignment: "right" }
                                ], marginBottom: 5
                            },
                            {
                                columns: [
                                    { text: "Prepared Date: ", fontSize: 10, bold: true, width: "auto" },
                                    { text: new Date().toLocaleDateString(), fontSize: 10, alignment: "right" }
                                ], marginBottom: 5
                            },
                            report === "daily" ?
                                {
                                    columns: [
                                        { text: "New Bookings: ", fontSize: 10, bold: true, width: "auto" },
                                        { text: newBooksTotal.toLocaleString(), fontSize: 10, alignment: "right" }
                                    ], marginBottom: 5
                                }
                                :
                                {
                                    columns: [
                                        { text: "Total Bookings: ", fontSize: 10, bold: true, width: "auto" },
                                        { text: totalBookings.toLocaleString(), fontSize: 10, alignment: "right" }
                                    ], marginBottom: 5
                                }
                        ]
                    ], marginBottom: 20
                },
                report !== "daily" ? {} : {
                    table: {
                        widths: ['auto', '*', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
                        headerRows: 3,
                        body: [
                            [
                                { text: "Check In Today", alignment: 'center', colSpan: 9, fontSize: 12, bold: true }, "", "", "", "", "", "", "", ""
                            ],
                            [
                                { text: "No.", rowSpan: 2, alignment: 'center', fontSize: 10 }, { text: "Guest", alignment: 'center', colSpan: 4, fontSize: 10, bold: true }, "", "", "", { text: "Reservation", alignment: 'center', colSpan: 4, fontSize: 10, bold: true }, "", "", ""
                            ],
                            [
                                "",
                                { text: "Name", alignment: 'center', fontSize: 10 },
                                { text: "Sex", alignment: 'center', fontSize: 10 },
                                { text: "Age", alignment: 'center', fontSize: 10 },
                                { text: "Contact Number", alignment: 'center', fontSize: 10 },
                                { text: "Room/s", alignment: 'center', fontSize: 10 },
                                { text: "Paid", alignment: 'center', fontSize: 10 },
                                { text: "Total", alignment: 'center', fontSize: 10 },
                                { text: "Left to Pay", alignment: 'center', fontSize: 10 },
                            ],
                            ...bookTable(checkIn)
                        ]
                    }, marginBottom: 20
                },
                report !== "daily" ? {} : {
                    table: {
                        widths: ['auto', '*', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
                        headerRows: 3,
                        body: [
                            [
                                { text: "Check Out Today", alignment: 'center', colSpan: 9, fontSize: 12, bold: true }, "", "", "", "", "", "", "", ""
                            ],
                            [
                                { text: "No.", rowSpan: 2, alignment: 'center', fontSize: 10 }, { text: "Guest", alignment: 'center', colSpan: 4, fontSize: 10, bold: true }, "", "", "", { text: "Reservation", alignment: 'center', colSpan: 4, fontSize: 10, bold: true }, "", "", ""
                            ],
                            [
                                "",
                                { text: "Name", alignment: 'center', fontSize: 10 },
                                { text: "Sex", alignment: 'center', fontSize: 10 },
                                { text: "Age", alignment: 'center', fontSize: 10 },
                                { text: "Contact Number", alignment: 'center', fontSize: 10 },
                                { text: "Room/s", alignment: 'center', fontSize: 10 },
                                { text: "Paid", alignment: 'center', fontSize: 10 },
                                { text: "Total", alignment: 'center', fontSize: 10 },
                                { text: "Left to Pay", alignment: 'center', fontSize: 10 },
                            ],
                            ...bookTable(checkOut)
                        ]
                    }, marginBottom: 20
                },
                report !== "daily" ?
                    {
                        table: {
                            widths: ["*", "auto", "auto"],
                            headerRows: 1,
                            body: [
                                [
                                    { text: "Booking", colSpan: 3, alignment: 'center', fontSize: 12, bold: true }, "", ""
                                ],
                                [
                                    { text: "Status", alignment: 'center', fontSize: 10 },
                                    { text: "Total Booked", alignment: 'center', fontSize: 10 },
                                    { text: "Total Amount", alignment: 'center', fontSize: 10 }
                                ],
                                ...statusTable(totalPerStatus),
                                [
                                    { text: "Sum Total", alignment: 'center', fontSize: 10, bold: true },
                                    { text: totalBookings.toLocaleString(), alignment: 'center', fontSize: 10, bold: true },
                                    { text: totalPerStatus.reduce((total, status) => total + status.totalAmount, 0).toLocaleString(), alignment: 'right', fontSize: 10, bold: true }
                                ]
                            ]
                        }, marginBottom: 20
                    }
                    :
                    {
                        columnGap: 20,
                        columns: [
                            {
                                table: {
                                    widths: ["auto", "auto", "*"],
                                    headerRows: 1,
                                    body: [
                                        [
                                            { text: "Room Availability Today", alignment: 'center', colSpan: 3, fontSize: 12, bold: true }, "", ""
                                        ],
                                        ...roomAvailabilityTable(roomAvailability)
                                    ]
                                }
                            },
                            {
                                table: {
                                    widths: ["*", "auto", "auto"],
                                    headerRows: 1,
                                    body: [
                                        [
                                            { text: "Booking", colSpan: 3, alignment: 'center', fontSize: 12, bold: true }, "", ""
                                        ],
                                        [
                                            { text: "Status", alignment: 'center', fontSize: 10 },
                                            { text: "Total Booked", alignment: 'center', fontSize: 10 },
                                            { text: "Total Amount", alignment: 'center', fontSize: 10 }
                                        ],
                                        ...statusTable(totalPerStatus),
                                        [
                                            { text: "Sum Total", alignment: 'center', fontSize: 10, bold: true },
                                            { text: totalPerStatus.reduce((total, status) => total + status.totalBooks, 0).toLocaleString(), alignment: 'center', fontSize: 10, bold: true },
                                            { text: totalPerStatus.reduce((total, status) => total + status.totalAmount, 0).toLocaleString(), alignment: 'right', fontSize: 10, bold: true }
                                        ]
                                    ]
                                }
                            },
                        ], marginBottom: 20
                    },
                {
                    table: {
                        widths: ["auto", "*", 100],
                        body: [
                            [
                                { text: "Payments", alignment: 'center', colSpan: 3, fontSize: 12, bold: true }, "", ""
                            ],
                            [
                                { text: "No.", alignment: 'center', fontSize: 10 },
                                { text: "Guest", alignment: 'center', fontSize: 10 },
                                { text: "Amount", alignment: 'center', fontSize: 10 }
                            ],
                            ...dailyPaymentTable(payments),
                            [
                                { text: "Total", alignment: 'center', colSpan: 2, fontSize: 10, bold: true }, "",
                                { text: payments.reduce((total, payment) => total + parseInt(payment.amount), 0).toLocaleString(), alignment: 'right', fontSize: 10, bold: true }
                            ]
                        ]
                    }
                }
            ]
        }

        pdfMake.createPdf(docDefinition).open()
    }

    return (
        <div className='report'>
            <h1>Generate Report</h1>
            <hr />
            {isLoading ?
                <Loader2 />
                :
                <div className='report-content'>
                    <div className='report-bttns'>
                        <select value={report} onChange={e => setReport(e.target.value)}>
                            <option value="">--select--</option>
                            <option value="daily">Daily</option>
                            <option value="weekly">Weekly</option>
                            <option value="monthly">Monthly</option>
                            <option value="yearly">Yearly</option>
                        </select>
                        {report && <button onClick={generateReport} className='generate'>Generate</button>}
                    </div>
                    {report === "daily" &&
                        <DatePicker
                            selected={day}
                            onChange={date => setDay(date)}
                            maxDate={new Date()}
                            inline
                        />
                    }
                    {report === "weekly" &&
                        <DatePicker
                            selected={week}
                            onChange={date => setWeek(date)}
                            showWeekPicker
                            maxDate={new Date()}
                            inline
                        />
                    }
                    {report === "monthly" &&
                        <DatePicker
                            selected={month}
                            onChange={date => setMonth(date)}
                            showMonthYearPicker
                            showFullMonthYearPicker
                            maxDate={new Date()}
                            inline
                        />
                    }
                    {report === "yearly" &&
                        <DatePicker
                            selected={year}
                            onChange={date => setYear(date)}
                            showYearPicker
                            maxDate={new Date()}
                            yearItemNumber={9}
                            inline
                        />
                    }
                </div>
            }
        </div>
    )
}

export default Report