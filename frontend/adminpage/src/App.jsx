import Login from './components/Login'
import { Routes, Route, Navigate } from 'react-router-dom'
import useAdmin from './hooks/useAdmin'

import Navigations from './pages/Navigations'
import Dashboard from './pages/Dashboard'
import Configuration from './pages/Configuration'
import Utilities from './pages/Utilities'
import Help from './pages/Help'

import Rooms from './pages/Configurations/Rooms'
import Success from './components/Success'
import Failed from './components/Failed'

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
                            <Route path='amenity' element={<h1>Amenity</h1>} />
                            <Route path='gallery' element={<h1>Gallery</h1>} />
                            <Route path='about-us' element={<h1>About Us</h1>} />
                        </Route>
                        <Route path='utilities' element={<Utilities />}>
                            <Route path='archive' element={<h1>Rooms</h1>} />
                            <Route path='activity-logs' element={<h1>Amenities</h1>} />
                            <Route path='database' element={<h1>Gallery</h1>} />
                            <Route path='users' element={<h1>Users</h1>} />
                            <Route path='admins' element={<h1>Admins</h1>} />
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
