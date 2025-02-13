import Login from './components/Login'
import { Routes, Route, Navigate } from 'react-router-dom'
import useAdmin from './hooks/useAdmin'

import Navigations from './pages/Navigations'
import Dashboard from './pages/Dashboard'
import Configuration from './pages/Configuration'
import Utilities from './pages/Utilities'
import Help from './pages/Help'

import Rooms from './pages/Configurations/Rooms'
import Amenities from './pages/Configurations/Amenities'
import Gallery from './pages/Configurations/Gallery'
import AboutUs from './pages/Configurations/AboutUs'

import Success from './components/Success'
import Failed from './components/Failed'

import ActivityLogs from './pages/Utilities/ActivityLogs'

// PDF
import pdfMake from 'pdfmake/build/pdfmake'
import pdfFonts from 'pdfmake/build/vfs_fonts'
pdfMake.vfs = pdfFonts.pdfMake ? pdfFonts.pdfMake.vfs : pdfFonts.vfs
// PDF

function App() {
    const { state } = useAdmin()

    return (
        <>
            <Routes>
                {state.admin ?
                    <Route path="/" element={<Navigations />}>
                        <Route index element={<h1>Index</h1>} />
                        <Route path='dashboard' element={<Dashboard />}>
                            <Route path='booking' element={<h1>Booking</h1>} />
                            <Route path='report' element={<h1>Report</h1>} />
                        </Route>
                        <Route path='configuration' element={<Configuration />}>
                            <Route path='room' element={<Rooms />} />
                            <Route path='amenity' element={<Amenities />} />
                            <Route path='gallery' element={<Gallery />} />
                            <Route path='about-us' element={<AboutUs />} />
                        </Route>
                        <Route path='utilities' element={<Utilities />}>
                            <Route path='archive' element={<h1>WHAHAHA</h1>} />
                            <Route path='activity-logs' element={<ActivityLogs />} />
                            <Route path='database' element={<h1>WHAHAHA</h1>} />
                            <Route path='users' element={<h1>WHAHAHA</h1>} />
                            <Route path='admins' element={<h1>WHAHAHA</h1>} />
                        </Route>
                        <Route path='help' element={<Help />}>
                            <Route path='user-manual' element={<h1>User Manual</h1>} />
                        </Route>
                        <Route path="*" element={<Navigate to='/' />} />
                    </Route>
                    :
                    <>
                        <Route path='login' element={<Login />} />
                        <Route path="*" element={<Navigate to='/login' />} />
                    </>
                }
                <Route path='hello-world' element={<h1>Hello World!</h1>} />
            </Routes>
            {state.success && <Success />}
            {state.failed && <Failed />}
        </>
    )
}

export default App
