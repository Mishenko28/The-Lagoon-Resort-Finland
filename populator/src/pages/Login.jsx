import { useState } from "react"
import axios from "axios"


const Login = ({ setAdmin, saveAdmin }) => {
    const [email, setEmail] = useState("johnthomasalog@gmail.com")
    const [password, setPassword] = useState("thomas1228")

    const login = async (e) => {
        e.preventDefault()

        axios.post("admin/login", { email, password })
            .then(({ data: { email, token } }) => {
                saveAdmin({ email, token })
                setAdmin({ email, token })
            })

    }

    return (
        <div className='login'>
            <form onSubmit={login}>
                <h1>Data Populator</h1>
                <input
                    placeholder="Email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    type="email"
                />
                <input
                    value={password}
                    placeholder="Password"
                    onChange={e => setPassword(e.target.value)}
                    type="password"
                />
                <button type="submit">Login</button>
            </form>
        </div>
    )
}

export default Login