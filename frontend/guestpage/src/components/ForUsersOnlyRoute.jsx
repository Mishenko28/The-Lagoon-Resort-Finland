import { useEffect, useState } from 'react'
import useAdmin from '../hooks/useAdmin'
import { useNavigate } from 'react-router-dom'

const ForUsersOnlyRoute = ({ component }) => {
    const { state } = useAdmin()
    const navigate = useNavigate()

    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        if (state.user) navigate('/')
        else setIsLoading(false)
    }, [state.user])

    if (!isLoading) return component
}

export default ForUsersOnlyRoute