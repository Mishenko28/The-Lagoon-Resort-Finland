import axios from 'axios'
import { useState, useRef, useEffect } from "react"
import useAdmin from '../hooks/useAdmin'
import { motion, AnimatePresence } from 'framer-motion'

export default function Email({ emails, setEmails }) {
    const { dispatch } = useAdmin()

    const emailRef = useRef(null)
    const [emailLoad, setEmailLoad] = useState(false)
    const [emailEdit, setEmailEdit] = useState(null)
    const [newEmail, setNewEmail] = useState(null)
    const [newEmailTogg, setNewEmailTogg] = useState(null)
    const [emailToDelete, setEmailToDelete] = useState(null)


    useEffect(() => {
        newEmailTogg && emailRef.current.focus()
    }, [newEmailTogg])


    const updateEmail = async () => {
        setEmailLoad(true)

        await axios.patch('/admin-settings/update', { emails: emailEdit })
            .then((res) => {
                setEmails(res.data.adminSetting.emails)
                dispatch({ type: 'SUCCESS', payload: true })
            })
            .catch((err) => {
                dispatch({ type: 'FAILED', payload: err.response.data.error })
                console.log(err.response.data.error)
            })
            .finally(() => {
                setEmailEdit(null)
                setEmailLoad(false)
            })
    }

    const deleteEmail = async (i) => {
        setEmailLoad(true)
        setEmailToDelete(null)

        await axios.patch('/admin-settings/update', { emails: emails.filter((_, index) => index !== i) })
            .then((res) => {
                setEmails(res.data.adminSetting.emails)
                setEmailEdit(prev => prev.filter((_, index) => index !== i))
                dispatch({ type: 'SUCCESS', payload: true })
            })
            .catch((err) => {
                dispatch({ type: 'FAILED', payload: err.response.data.error })
                console.log(err.response.data.error)
            })
            .finally(() => {
                setEmailLoad(false)
            })
    }

    const addEmail = async (e) => {
        e.preventDefault()
        setEmailLoad(true)

        await axios.patch('/admin-settings/update', { emails: [...emails, newEmail] })
            .then((res) => {
                setEmails(res.data.adminSetting.emails)
                setNewEmail(null)
                setNewEmailTogg(false)
                dispatch({ type: 'SUCCESS', payload: true })
            })
            .catch((err) => {
                dispatch({ type: 'FAILED', payload: err.response.data.error })
                console.log(err.response.data.error)
            })
            .finally(() => {
                setEmailLoad(false)
            })
    }


    return (
        <div className="about-us-phone-num-cont">
            {emailLoad && <div className="loader-line"></div>}
            <div className="about-us-header">
                <h1>Emails:</h1>
                <div className="bttns">
                    {!emailEdit && !newEmailTogg && <i className="fa-solid fa-plus" onClick={() => setNewEmailTogg(true)} />}
                    {!emailEdit && !newEmailTogg && <i className="fa-solid fa-pen-to-square" onClick={() => setEmailEdit(emails)} />}
                    {(JSON.stringify(emailEdit) !== JSON.stringify(emails) && emailEdit && !emailLoad) && < i className="fa-solid fa-floppy-disk" onClick={updateEmail} />}
                    {emailEdit && <i className="fa-solid fa-square-xmark" onClick={() => setEmailEdit(null)} />}
                </div>
            </div>
            {!emailEdit &&
                <AnimatePresence mode='sync'>
                    {emails?.map((email, i) => (
                        <motion.div
                            layout
                            initial={{ opacity: 0.5, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.3 }}
                            className="phone-num-cont"
                            key={i}
                        >
                            <h4>{email}</h4>
                        </motion.div>
                    ))}
                </AnimatePresence>
            }
            {emailEdit &&
                <AnimatePresence mode='sync'>
                    {emailEdit.map((email, i) => (
                        <motion.div
                            layout
                            initial={{ opacity: 0.5, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.3 }}
                            className="phone-num-cont"
                            key={email}
                        >
                            <input type="email" value={email} onChange={e => setEmailEdit(prev => prev.map((email, index) => index === i ? e.target.value : email))} />
                            {(!emailLoad && email !== emails[i]) && <i className="fa-solid fa-rotate-left" onClick={() => setEmailEdit(prev => prev.map((data, index) => index === i ? emails[i] : data))} />}
                            {!emailLoad && <i className="fa-solid fa-trash-can" onClick={() => setEmailToDelete(email)} />}
                        </motion.div>
                    ))}
                </AnimatePresence>
            }
            <AnimatePresence>
                {newEmailTogg &&
                    <motion.form
                        layout
                        initial={{ opacity: 0.5, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.3 }}
                        className="phone-num-cont"
                        onSubmit={(e) => addEmail(e)}
                    >
                        <input ref={emailRef} type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} placeholder="email" />
                        {(newEmail && !emailLoad) && <button type="submit"><i className="fa-solid fa-floppy-disk" /></button>}
                        {!emailLoad && <i className="fa-solid fa-square-xmark" onClick={() => setNewEmailTogg(false)} />}
                    </motion.form>
                }
            </AnimatePresence>
            {emailToDelete &&
                <div className='full-cont'>
                    <div className='confirmation-cont'>
                        <h1>Are you sure?</h1>
                        <h2>you are about to delete this email:</h2>
                        <div className='phone-num'>
                            <span>{emailToDelete}</span>
                        </div>
                        <div className='bttns'>
                            <button onClick={() => deleteEmail(emails.indexOf(emailToDelete))}><i className="fa-solid fa-trash-can" />Delete</button>
                            <button onClick={() => setEmailToDelete(null)}>Cancel</button>
                        </div>
                    </div>
                </div>
            }
        </div >
    )
}
