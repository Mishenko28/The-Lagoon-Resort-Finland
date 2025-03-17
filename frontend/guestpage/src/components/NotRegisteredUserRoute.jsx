import { useEffect, useState } from 'react'
import useAdmin from '../hooks/useAdmin'
import { useNavigate } from 'react-router-dom'

const NotRegisteredUserRoute = ({ component }) => {
    const { state } = useAdmin()
    const navigate = useNavigate()
    const book = new URLSearchParams(window.location.search).get('book')


    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        if (state.user && book) {
            navigate('/booking')
            return
        }
        if (state.user) navigate('/')
        else setIsLoading(false)
    }, [state.user])

    if (!isLoading) return component
}

export default NotRegisteredUserRoute