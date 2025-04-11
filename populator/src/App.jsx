import { useEffect, useState } from 'react'
import Header from './components/Header'
import Home from './pages/home'
import Login from './pages/Login'
import axios from 'axios'
import User from './pages/User'
import Booking from './pages/Booking'

const saveAdmin = ({ email, token }) => {
	localStorage.setItem("admin", JSON.stringify({ email, token }))
}

const getAdmin = () => {
	const admin = localStorage.getItem("admin")
	if (admin) return JSON.parse(admin)
	return null
}

const removeAdmin = () => {
	localStorage.removeItem("admin")
}

const App = () => {
	const [page, setPage] = useState("home")

	const [admin, setAdmin] = useState(getAdmin())

	useEffect(() => {
		axios.defaults.baseURL = "http://localhost:8000"
		axios.defaults.headers.common['Content-Type'] = 'application/json'

		if (admin) axios.defaults.headers.common['Authorization'] = `Bearer ${admin.token}`
	}, [admin])

	return (
		<div className='app'>
			{admin === null && <Login saveAdmin={saveAdmin} setAdmin={setAdmin} />}
			{admin &&
				<>
					<Header setAdmin={setAdmin} removeAdmin={removeAdmin} setPage={setPage} />
					{page === "home" && <Home />}
					{page === "user" && <User />}
					{page === "booking" && <Booking />}
				</>
			}
		</div>
	)
}

export default App