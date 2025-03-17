import { useState } from 'react'
import { Link } from 'react-router-dom'
import Loader from '../components/Loader'
import axios from 'axios'
import useAdmin from '../hooks/useAdmin'



const SignUp = () => {
    const { dispatch } = useAdmin()
    const book = new URLSearchParams(window.location.search).get('book')

    const [verified, setVerified] = useState(false)
    const [otpCreated, setOtpCreated] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [otp, setOtp] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault()
        setIsLoading(true)
        setError('')

        if (!otpCreated && !verified) createOTP()
        if (otpCreated && !verified) verifyOTP()
        if (verified) signUp()
    }

    const createOTP = () => {
        axios.post('otp/create', { email })
            .then(res => {
                if (res.data.message === 'OTP Sent') {
                    setOtpCreated(true)
                }
            })
            .catch(err => setError(err.response.data.error))
            .finally(() => setIsLoading(false))
    }

    const verifyOTP = () => {
        axios.post('otp/verify', { email, otp })
            .then(res => {
                if (res.data.message === 'OTP Verified') {
                    setVerified(true)
                }
            })
            .catch(err => setError(err.response.data.error))
            .finally(() => setIsLoading(false))
    }

    const signUp = () => {
        if (password !== confirmPassword) {
            setError('Passwords do not match')
            setIsLoading(false)
            return
        }

        axios.post('user/signup', { email, password })
            .then(res => {
                dispatch({ type: 'LOGIN', payload: res.data })
            })
            .catch(err => setError(err.response.data.error))
            .finally(() => setIsLoading(false))
    }


    return (
        <div className="sign-up">
            <img src="/loginSignUpBG.avif" />
            <form onSubmit={handleSubmit} className='login-and-sign-up-form'>
                <h1>SIGN UP</h1>
                {error && <p>{error}</p>}
                {isLoading ?
                    <Loader />
                    :
                    <>
                        {!otpCreated ?
                            <div className='input-cont'>
                                <label>Email:</label>
                                <input value={email} onChange={e => setEmail(e.target.value)} type="email" />
                            </div>
                            :
                            <>
                                {!verified &&
                                    <>
                                        <div className='input-cont'>
                                            <label>We've sent a One-Time Password (OTP) to your registered email.</label>
                                            <input disabled value={email} type="email" />
                                        </div>
                                        <div className='input-cont'>
                                            <label>Please enter the 6-digit code below to verify your identity.</label>
                                            <input value={otp} onChange={e => setOtp(e.target.value)} type="number" />
                                        </div>
                                    </>
                                }
                            </>
                        }
                        {verified &&
                            <>
                                <div className='input-cont'>
                                    <label>Email:</label>
                                    <input disabled value={email} type="email" />
                                </div>
                                <div className='input-cont'>
                                    <label>Password:</label>
                                    <input value={password} onChange={e => setPassword(e.target.value)} type="password" />
                                </div>
                                <div className='input-cont'>
                                    <label>Confirm Password:</label>
                                    <input value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} type="password" />
                                </div>
                            </>
                        }
                        <button disabled={isLoading} >{otpCreated ? 'VERIFY' : 'SIGN UP'}</button>
                        <h2>Already a user? <Link to={'/login' + (book && "?book=true")}>LOGIN</Link></h2>
                    </>
                }
            </form>
        </div>
    )
}

export default SignUp