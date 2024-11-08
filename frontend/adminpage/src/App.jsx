import Login from './components/Login'
import { Routes, Route, Navigate } from 'react-router-dom'
import useAdmin from './hooks/useAdmin'
import Navigations from './pages/Navigations'

function App() {
    const { state } = useAdmin()

    return (
        <Routes>
            {state.admin ?
                <Route path="/" element={<Navigations />}>
                    <Route index element={<h1>Index</h1>} />
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
    )
}

export default App
