import axios from 'axios'
import { useEffect, useState, useRef } from "react"
import useAdmin from '../hooks/useAdmin'
import { motion, AnimatePresence } from 'framer-motion'

export default function PhoneNumber({ phoneNums, setPhoneNums }) {
    const { dispatch } = useAdmin()

    const newPhoneNumRef = useRef()
    const [phoneNumsLoad, setPhoneNumsLoad] = useState(false)
    const [phoneNumEdit, setPhoneNumEdit] = useState(null)
    const [newPhoneNum, setNewPhoneNum] = useState(null)
    const [phoneNumToDelete, setPhoneNumToDelete] = useState(null)

    useEffect(() => {
        newPhoneNum && !newPhoneNum.sim && !newPhoneNum.number && newPhoneNumRef.current.focus()
    }, [newPhoneNum])

    const updatePhoneNums = async () => {
        setPhoneNumsLoad(true)

        await axios.patch('/admin-settings/update', { phoneNumbers: phoneNumEdit })
            .then((res) => {
                setPhoneNums(res.data.adminSetting.phoneNumbers)
                dispatch({ type: 'SUCCESS', payload: true })
            })
            .catch((err) => {
                dispatch({ type: 'FAILED', payload: err.response.data.error })
                console.log(err.response.data.error)
            })
            .finally(() => {
                setPhoneNumEdit(null)
                setPhoneNumsLoad(false)
            })
    }

    const deletePhoneNum = async (i) => {
        setPhoneNumsLoad(true)

        await axios.patch('/admin-settings/update', { phoneNumbers: phoneNums.filter((_, index) => index !== i) })
            .then((res) => {
                setPhoneNums(res.data.adminSetting.phoneNumbers)
                setPhoneNumEdit(prev => prev.filter((_, index) => index !== i))
                dispatch({ type: 'SUCCESS', payload: true })
            })
            .catch((err) => {
                dispatch({ type: 'FAILED', payload: err.response.data.error })
                console.log(err.response.data.error)
            })
            .finally(() => {
                setPhoneNumsLoad(false)
                setPhoneNumToDelete(null)
            })
    }

    const addPhoneNum = async (e) => {
        e.preventDefault()

        if (phoneNums.some(phoneNum => phoneNum.number === newPhoneNum.number)) {
            dispatch({ type: 'FAILED', payload: 'Phone number already exists' })
            return
        }

        setPhoneNumsLoad(true)

        await axios.patch('/admin-settings/update', { phoneNumbers: [...phoneNums, newPhoneNum] })
            .then((res) => {
                setPhoneNums(res.data.adminSetting.phoneNumbers)
                setNewPhoneNum(null)
                dispatch({ type: 'SUCCESS', payload: true })
            })
            .catch((err) => {
                dispatch({ type: 'FAILED', payload: err.response.data.error })
                console.log(err.response.data.error)
            })
            .finally(() => {
                setPhoneNumsLoad(false)
            })
    }

    return (
        <div className="about-us-phone-num-cont">
            {phoneNumsLoad && <div className="loader-line"></div>}
            <div className="about-us-header">
                <h1>Phone Numbers:</h1>
                <div className="bttns">
                    {!phoneNumEdit && !newPhoneNum && <i className="fa-solid fa-plus" onClick={() => setNewPhoneNum({ sim: "", number: "" })} />}
                    {!phoneNumEdit && !newPhoneNum && <i className="fa-solid fa-pen-to-square" onClick={() => setPhoneNumEdit(phoneNums)} />}
                    {(JSON.stringify(phoneNumEdit) !== JSON.stringify(phoneNums) && phoneNumEdit && !phoneNumsLoad) && < i className="fa-solid fa-floppy-disk" onClick={updatePhoneNums} />}
                    {phoneNumEdit && <i className="fa-solid fa-square-xmark" onClick={() => setPhoneNumEdit(null)} />}
                </div>
            </div>
            {!phoneNumEdit &&
                <AnimatePresence mode='sync'>
                    {phoneNums?.map((phoneNum, i) => (
                        <motion.div
                            layout
                            initial={{ opacity: 0.5, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.3 }}
                            className="phone-num-cont"
                            key={i}
                        >
                            <h2>{phoneNum.sim}</h2>
                            <h3>{phoneNum.number}</h3>
                        </motion.div>
                    ))}
                </AnimatePresence>
            }
            {phoneNumEdit &&
                <AnimatePresence mode='sync'>
                    {phoneNumEdit.map((phoneNum, i) => (
                        <motion.div
                            layout
                            initial={{ opacity: 0.5, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.3 }}
                            className="phone-num-cont"
                            key={phoneNum.number}
                        >
                            <input type="text" value={phoneNum.sim} onChange={e => setPhoneNumEdit(prev => prev.map((num, index) => index === i ? { ...num, sim: e.target.value } : num))} />
                            <input type="number" value={phoneNum.number} onChange={e => setPhoneNumEdit(prev => prev.map((sim, index) => index === i ? { ...sim, number: e.target.value } : sim))} />
                            {(!phoneNumsLoad && (phoneNum.sim !== phoneNums[i].sim || phoneNum.number !== phoneNums[i].number)) && <i className="fa-solid fa-rotate-left" onClick={() => setPhoneNumEdit(prev => prev.map((num, index) => index === i ? phoneNums[i] : num))} />}
                            {!phoneNumsLoad && <i className="fa-solid fa-trash-can" onClick={() => setPhoneNumToDelete({ ...phoneNum, index: i })} />}
                        </motion.div>
                    ))}
                </AnimatePresence>
            }
            <AnimatePresence>
                {newPhoneNum &&
                    <motion.form
                        layout
                        initial={{ opacity: 0.5, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.3 }}
                        className="phone-num-cont"
                        onSubmit={(e) => addPhoneNum(e)}
                    >
                        <input type="text" ref={newPhoneNumRef} value={newPhoneNum.sim} onChange={(e) => setNewPhoneNum(prev => ({ ...prev, sim: e.target.value }))} placeholder="sim" />
                        <input type="number" value={newPhoneNum.number} onChange={(e) => setNewPhoneNum(prev => ({ ...prev, number: e.target.value }))} placeholder="number" />
                        {(newPhoneNum.sim && newPhoneNum.number && !phoneNumsLoad) && <button type="submit"><i className="fa-solid fa-floppy-disk" /></button>}
                        {!phoneNumsLoad && <i className="fa-solid fa-square-xmark" onClick={() => setNewPhoneNum(null)} />}
                    </motion.form>
                }
            </AnimatePresence>
            {phoneNumToDelete &&
                <div className='full-cont'>
                    <div className='confirmation-cont'>
                        <h1>Are you sure?</h1>
                        <h2>you are about to delete this number:</h2>
                        <div className='phone-num'>
                            <span>{phoneNumToDelete.sim}</span>
                            <span>{phoneNumToDelete.number}</span>
                        </div>
                        <div className='bttns'>
                            <button onClick={() => deletePhoneNum(phoneNumToDelete.index)}><i className="fa-solid fa-trash-can" />Delete</button>
                            <button onClick={() => setPhoneNumToDelete(null)}>Cancel</button>
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}
