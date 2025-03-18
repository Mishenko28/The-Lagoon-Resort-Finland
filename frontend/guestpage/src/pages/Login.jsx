import { useState } from 'react'
import '../styles/loginAndSignUp.css'
import { Link } from 'react-router-dom'
import axios from 'axios'
import useAdmin from '../hooks/useAdmin'
import Loader from '../components/Loader'



const Login = () => {
    const { dispatch } = useAdmin()
    const book = new URLSearchParams(window.location.search).get('book')

    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const submit = (e) => {
        e.preventDefault()
        setIsLoading(true)

        axios.post('user/login', { email, password })
            .then(res => {
                dispatch({ type: 'LOGIN', payload: res.data })
            })
            .catch(err => setError(err.response.data.error))
            .finally(() => setIsLoading(false))
    }


    return (
        <div className="login">
            <img src="/loginSignUpBG.avif" />
            <form onSubmit={submit} className='login-and-sign-up-form'>
                <h1>LOGIN</h1>
                {isLoading ?
                    <Loader />
                    :
                    <>
                        {error && <p>{error}</p>}
                        <div className='input-cont'>
                            <label>Email:</label>
                            <input value={email} onChange={e => setEmail(e.target.value)} type="email" />
                        </div>
                        <div className='input-cont'>
                            <label>Password:</label>
                            <input value={password} onChange={e => setPassword(e.target.value)} type="password" />
                        </div>
                        <button disabled={isLoading}>LOGIN</button>
                        <h2>Need an account? <Link to={'/sign-up' + (book ? "?book=true" : "")}>SIGNUP</Link></h2>
                    </>
                }

            </form>
        </div>
    )
}

export default Login