import axios from 'axios'
import { useState } from "react"
import useAdmin from '../hooks/useAdmin'
import { motion, AnimatePresence } from 'framer-motion'

export default function Socials({ socials, setSocials }) {
    const { dispatch } = useAdmin()

    const [socialLoad, setSocialLoad] = useState(false)
    const [socialEdit, setSocialEdit] = useState(null)
    const [newSocial, setNewSocial] = useState(null)
    const [socialToDelete, setSocialToDelete] = useState(null)

    const updateSocials = async () => {
        setSocialLoad(true)

        await axios.patch('/admin-settings/update', { socials: socialEdit })
            .then((res) => {
                setSocials(res.data.adminSetting.socials)
                dispatch({ type: 'SUCCESS', payload: true })
            })
            .catch((err) => {
                dispatch({ type: 'FAILED', payload: err.response.data.error })
                console.log(err.response.data.error)
            })
            .finally(() => {
                setSocialEdit(null)
                setSocialLoad(false)
            })
    }

    const deleteSocial = async (i) => {
        setSocialLoad(true)
        setSocialToDelete(null)

        await axios.patch('/admin-settings/update', { socials: socials.filter((_, index) => index !== i) })
            .then((res) => {
                setSocials(res.data.adminSetting.socials)
                setSocialEdit(prev => prev.filter((_, index) => index !== i))
                dispatch({ type: 'SUCCESS', payload: true })
            })
            .catch((err) => {
                dispatch({ type: 'FAILED', payload: err.response.data.error })
                console.log(err.response.data.error)
            })
            .finally(() => {
                setSocialLoad(false)
            })
    }

    const addSocial = async (e) => {
        e.preventDefault()
        setSocialLoad(true)

        await axios.patch('/admin-settings/update', { socials: [...socials, newSocial] })
            .then((res) => {
                setSocials(res.data.adminSetting.socials)
                setNewSocial(null)
                dispatch({ type: 'SUCCESS', payload: true })
            })
            .catch((err) => {
                dispatch({ type: 'FAILED', payload: err.response.data.error })
                console.log(err.response.data.error)
            })
            .finally(() => {
                setSocialLoad(false)
            })
    }

    return (
        <div className="about-us-phone-num-cont">
            {socialLoad && <div className="loader-line"></div>}
            <div className="about-us-header">
                <h1>Social Accounts:</h1>
                <div className="bttns">
                    {!socialEdit && !newSocial && <i className="fa-solid fa-plus" onClick={() => setNewSocial({ app: "", link: "" })} />}
                    {!socialEdit && !newSocial && <i className="fa-solid fa-pen-to-square" onClick={() => setSocialEdit(socials)} />}
                    {(JSON.stringify(socialEdit) !== JSON.stringify(socials) && socialEdit && !socialLoad) && < i className="fa-solid fa-floppy-disk" onClick={updateSocials} />}
                    {socialEdit && <i className="fa-solid fa-square-xmark" onClick={() => setSocialEdit(null)} />}
                </div>
            </div>
            {!socialEdit &&
                <AnimatePresence mode='sync'>
                    {socials?.map(social => (
                        <motion.div
                            layout
                            initial={{ opacity: 0.5, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.3 }}
                            className="phone-num-cont"
                            key={social._id}
                        >
                            <h2>{social.app}</h2>
                            <h3 className='link'>{social.link}</h3>
                        </motion.div>
                    ))}
                </AnimatePresence>
            }
            {socialEdit &&
                <AnimatePresence mode='sync'>
                    {socialEdit.map((social, i) => (
                        <motion.div
                            layout
                            initial={{ opacity: 0.5, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.3 }}
                            className="phone-num-cont"
                            key={social._id}
                        >
                            <select value={social.app} onChange={e => setSocialEdit(prev => prev.map((app, index) => index === i ? { ...app, app: e.target.value } : app))}>
                                <option value="facebook">Facebook</option>
                                <option value="twitter">Twitter</option>
                                <option value="instagram">Instagram</option>
                                <option value="youtube">Youtube</option>
                            </select>
                            <input type="link" value={social.link} onChange={e => setSocialEdit(prev => prev.map((app, index) => index === i ? { ...app, link: e.target.value } : app))} />
                            {(!socialLoad && (social.app !== socials[i].app || social.link !== socials[i].link)) && <i className="fa-solid fa-rotate-left" onClick={() => setSocialEdit(prev => prev.map((data, index) => index === i ? socials[i] : data))} />}
                            {!socialLoad && <i className="fa-solid fa-trash-can" onClick={() => setSocialToDelete({ ...social, index: i })} />}
                        </motion.div>
                    ))}
                </AnimatePresence>
            }
            <AnimatePresence>
                {newSocial &&
                    <motion.form
                        layout
                        initial={{ opacity: 0.5, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.3 }}
                        className="phone-num-cont"
                        onSubmit={(e) => addSocial(e)}
                    >
                        <select value={newSocial.app} onChange={(e) => setNewSocial(prev => ({ ...prev, app: e.target.value }))}>
                            <option value="">--select--</option>
                            <option value="facebook">Facebook</option>
                            <option value="twitter">Twitter</option>
                            <option value="instagram">Instagram</option>
                            <option value="youtube">Youtube</option>
                        </select>
                        <input type="link" value={newSocial.link} onChange={(e) => setNewSocial(prev => ({ ...prev, link: e.target.value }))} placeholder="link" />
                        {(newSocial.app && newSocial.link && !socialLoad) && <button type="submit"><i className="fa-solid fa-floppy-disk" /></button>}
                        {!socialLoad && <i className="fa-solid fa-square-xmark" onClick={() => setNewSocial(null)} />}
                    </motion.form>
                }
            </AnimatePresence>
            {socialToDelete &&
                <div className='full-cont'>
                    <div className='confirmation-cont'>
                        <h1>Are you sure?</h1>
                        <h2>you are about to delete this account:</h2>
                        <div className='phone-num'>
                            <span>{socialToDelete.app}</span>
                            <span>{socialToDelete.link}</span>
                        </div>
                        <div className='bttns'>
                            <button onClick={() => deleteSocial(socialToDelete.index)}><i className="fa-solid fa-trash-can" />Delete</button>
                            <button onClick={() => setSocialToDelete(null)}>Cancel</button>
                        </div>
                    </div>
                </div>
            }
        </div >
    )
}
