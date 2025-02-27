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
import Admins from './pages/Utilities/Admins'
import Profile from './pages/Profile'
import AdminInvite from './pages/AdminInvite'
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
                        {['booking', 'reports'].some(section => state.admin.role.includes(section)) &&
                            <Route path='dashboard' element={<Dashboard />}>
                                {state.admin.role.includes('booking') && <Route path='booking' element={<h1>Booking</h1>} />}
                                {state.admin.role.includes('reports') && <Route path='report' element={<h1>Report</h1>} />}
                            </Route>
                        }
                        {['room', 'amenity', 'gallery', 'aboutUs'].some(section => state.admin.role.includes(section)) &&
                            <Route path='configuration' element={<Configuration />}>
                                {state.admin.role.includes('room') && <Route path='room' element={<Rooms />} />}
                                {state.admin.role.includes('amenity') && <Route path='amenity' element={<Amenities />} />}
                                {state.admin.role.includes('gallery') && <Route path='gallery' element={<Gallery />} />}
                                {state.admin.role.includes('aboutUs') && <Route path='about-us' element={<AboutUs />} />}
                            </Route>
                        }
                        {['archive', 'activityLogs', 'database', 'users', 'admins'].some(section => state.admin.role.includes(section)) &&
                            <Route path='utilities' element={<Utilities />}>
                                {state.admin.role.includes('archive') && <Route path='archive' element={<h1>In Developing</h1>} />}
                                {state.admin.role.includes('activityLogs') && <Route path='activity-logs' element={<ActivityLogs />} />}
                                {state.admin.role.includes('database') && <Route path='database' element={<h1>In Developing</h1>} />}
                                {state.admin.role.includes('users') && <Route path='users' element={<h1>In Developing</h1>} />}
                                {state.admin.role.includes('admins') && <Route path='admins' element={<Admins />} />}
                            </Route>
                        }
                        <Route path='help' element={<Help />}>
                            <Route path='user-manual' element={<h1>User Manual</h1>} />
                        </Route>
                        <Route path="profile" element={<Profile />} />
                        <Route path="*" element={<Navigate to='/' />} />
                    </Route>
                    :
                    <>
                        <Route path='login' element={<Login />} />
                        <Route path="*" element={<Navigate to='/login' />} />
                    </>
                }
                <Route path='admin-invite' element={<AdminInvite />} />
                <Route path='hello-world' element={<h1>Hello World!</h1>} />
            </Routes>
            {state.success && <Success />}
            {state.failed && <Failed />}
        </>
    )
}

export default App
