import "react-datepicker/dist/react-datepicker.css"
import Login from './components/Login'
import { Routes, Route, Navigate } from 'react-router-dom'
import useAdmin from './hooks/useAdmin'

import Graph from "./pages/Graph"

import Navigations from './pages/Navigations'
import Dashboard from './pages/Dashboard'
import Configuration from './pages/Configuration'
import Utilities from './pages/Utilities'
import Help from './pages/Help'

import Rooms from './pages/Configurations/Rooms'
import Amenities from './pages/Configurations/Amenities'
import Gallery from './pages/Configurations/Gallery'
import AboutUs from './pages/Configurations/AboutUs'

import Admins from './pages/Utilities/Admins'
import AdminInvite from './pages/AdminInvite'
import ActivityLogs from './pages/Utilities/ActivityLogs'
import Database from "./pages/Utilities/Database"
import Archive from "./pages/Utilities/Archive"
import Users from "./pages/Utilities/Users"

import Booking from './pages/Dashboard/Booking'
import Report from "./pages/Dashboard/Report"

import UserManual from "./pages/Help/UserManual"

import Profile from './pages/Profile'
import Success from './components/Success'
import Failed from './components/Failed'

function App() {
    const { state } = useAdmin()

    return (
        <>
            <Routes>
                {state.admin ?
                    <Route path="/" element={<Navigations />}>
                        <Route index element={<Graph />} />
                        {['booking', 'reports'].some(section => state.admin.role.includes(section)) &&
                            <Route path='dashboard' element={<Dashboard />}>
                                {state.admin.role.includes('booking') && <Route path='booking' element={<Booking />} />}
                                {state.admin.role.includes('reports') && <Route path='report' element={<Report />} />}
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
                                {state.admin.role.includes('archive') && <Route path='archive' element={<Archive />} />}
                                {state.admin.role.includes('activityLogs') && <Route path='activity-logs' element={<ActivityLogs />} />}
                                {state.admin.role.includes('database') && <Route path='database' element={<Database />} />}
                                {state.admin.role.includes('users') && <Route path='users' element={<Users />} />}
                                {state.admin.role.includes('admins') && <Route path='admins' element={<Admins />} />}
                            </Route>
                        }
                        <Route path='help' element={<Help />}>
                            <Route path='user-manual' element={<UserManual />} />
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