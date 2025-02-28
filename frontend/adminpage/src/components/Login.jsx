import '../styles/login.css'
import Loader from '../components/loader'
import axios from 'axios'
import useAdmin from '../hooks/useAdmin'
import { useState } from 'react'

function Login() {
    const { dispatch } = useAdmin()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')

    const [isLoading, setIsLoading] = useState(false)
    const [isPassHide, setIsPassHide] = useState(true)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)

        await axios.post('/admin/login', {
            email: email,
            password: password
        })
            .then((res) => {
                dispatch({ type: 'LOGIN', payload: res.data })
                setPassword('')
            })
            .catch((err) => {
                setError(err.response.data.error)
            })
            .finally(() => {
                setIsLoading(false)
            })
    }

    return (
        <div className='login-container'>
            <h2>Login</h2>
            {isLoading ?
                <Loader />
                :
                <>
                    <form onSubmit={handleSubmit}>
                        {error && <p className='error'>{error}</p>}
                        <div>
                            <label>Email:</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder='Enter your admin email'
                                required
                            />
                        </div>
                        <div>
                            <label>Password:</label>
                            <input
                                type={isPassHide ? "password" : "text"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder='Enter your password'
                                required
                            />
                            {
                                password.length > 0 &&
                                <button type='button' className='show-pass' onClick={() => setIsPassHide(!isPassHide)}>
                                    {isPassHide ? 'Show' : 'Hide'}
                                </button>
                            }
                        </div>
                        <button type="submit">Login</button>
                    </form>
                </>
            }
        </div>
    )
}

export default Login