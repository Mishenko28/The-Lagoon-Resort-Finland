import { useState } from "react"
import useAdmin from "../hooks/useAdmin"
import axios from "axios"

export default function InviteOptions({ setInvites, inviteOptionTogg, setInviteOptionTogg }) {
    const { dispatch } = useAdmin()

    const [email, setEmail] = useState(inviteOptionTogg.email)
    const [isLoading, setIsLoading] = useState(false)
    const [deleteTogg, setDeleteTogg] = useState(false)

    const [copyHTMLText, setcopyHTMLText] = useState('Copy Link')

    const handleResend = async (e) => {
        e.preventDefault()

        setIsLoading(true)

        axios.post('admin/reinvite', { newEmail: email, oldEmail: inviteOptionTogg.email })
            .then(res => {
                setInvites(prev => prev.map(invite => invite._id === res.data._id ? res.data.invite : invite))
                dispatch({ type: 'SUCCESS', payload: true })
                setInviteOptionTogg(null)
            })
            .catch(err => {
                dispatch({ type: 'FAILED', payload: err.response.data.error })
                console.log(err)
            })
            .finally(() => {
                setIsLoading(false)
            })
    }

    const handleDelete = async (e) => {
        e.preventDefault()

        setIsLoading(true)

        axios.delete('admin/invite', { data: { _id: inviteOptionTogg._id } })
            .then(res => {
                setInvites(prev => prev.filter(invite => invite._id !== res.data.invite._id))
                setInviteOptionTogg(null)
                dispatch({ type: 'SUCCESS', payload: true })
            })
            .catch(err => {
                dispatch({ type: 'FAILED', payload: err.response.data.error })
                console.log(err)
            })
            .finally(() => {
                setIsLoading(false)
            })
    }

    const handleCopy = () => {
        navigator.clipboard.writeText(inviteOptionTogg.link)
        setcopyHTMLText('Copied!')
    }


    return (
        <div className="full-cont">
            <form onSubmit={handleResend} className="invite-options">
                {isLoading && <div className="loader-line"></div>}
                <i onClick={() => setInviteOptionTogg(null)} className="fa-solid fa-xmark" />
                <h1>Invite Options</h1>
                {deleteTogg ?
                    <>
                        <h4>Are you sure you want to delete this link?</h4>
                        <div className="bttns">
                            <button onClick={handleDelete} className="del"><i className="fa-solid fa-trash-can" />Delete</button>
                            <button onClick={() => setDeleteTogg(false)}>Cancel</button>
                        </div>
                    </>
                    :
                    <>
                        <h2>Email</h2>
                        <input onChange={(e) => setEmail(e.target.value)} value={email} type="email" />
                        <h2>Link</h2>
                        <div className="link-wrapper">
                            <h3>{inviteOptionTogg.link}</h3>
                            <button type="button" onClick={handleCopy} className="copy">{copyHTMLText}</button>
                        </div>
                        <div className="bttns">
                            <button disabled={isLoading} type="submit">Resend</button>
                            <button onClick={() => setInviteOptionTogg(null)}>Cancel</button>
                            <button onClick={() => setDeleteTogg(true)} disabled={isLoading}>Delete Link</button>
                        </div>
                    </>
                }

            </form>
        </div>
    )
}
