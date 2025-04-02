// PDF
import pdfMake from 'pdfmake/build/pdfmake'
import pdfFonts from 'pdfmake/build/vfs_fonts'
pdfMake.vfs = pdfFonts.pdfMake ? pdfFonts.pdfMake.vfs : pdfFonts.vfs
// PDF

import axios from 'axios'
import { useEffect, useState } from 'react'
import DatePicker from 'react-datepicker'


const Report = () => {
    const [books, setBooks] = useState([])
    const [report, setReport] = useState("")

    const [day, setDay] = useState(new Date())
    const [week, setWeek] = useState(new Date())
    const [month, setMonth] = useState(new Date())
    const [year, setYear] = useState(new Date())

    useEffect(() => {
        axios.get("book/completed", { params: { month: new Date() } })
            .then(res => setBooks(res.data))
    }, [])

    const generatePDF = () => {
        /** @type {import('pdfmake/interfaces').TDocumentDefinitions} */

        const bookTable = () => {
            let table = books.map(book => {
                return [
                    book._id,
                    book.total
                ]
            })

            table.unshift([{ text: 'Booking ID', bold: true }, 'Total'])

            return table
        }

        const docDefinition = {
            content: [
                'Bulleted list example:',
                {
                    // to treat a paragraph as a bulleted list, set an array of items under the ul key
                    ul: [
                        'Item 1',
                        'Item 2',
                        'Item 3',
                        { text: 'Item 4', bold: true },
                    ]
                },

                'Numbered list example:',
                {
                    // for numbered lists set the ol key
                    ol: [
                        'Item 1',
                        'Item 2',
                        'Item 3'
                    ]
                }
            ]
        }

        pdfMake.createPdf(docDefinition).open()
    }

    return (
        <div className='report'>
            <h1>Generate Report</h1>
            <hr />
            <div className='report-content'>
                <div className='report-bttns'>
                    <select value={report} onChange={e => setReport(e.target.value)}>
                        <option value="">--select--</option>
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                        <option value="yearly">Yearly</option>
                    </select>
                    {report && <button onClick={generatePDF} className='generate'>Generate</button>}
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
        </div>
    )
}

export default Report