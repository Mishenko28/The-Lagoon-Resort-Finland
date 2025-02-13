import { useEffect, useState } from "react"
import Loader2 from "../../components/Loader2"
import axios from 'axios'
import useAdmin from '../../hooks/useAdmin'

import PhoneNumber from "../../components/PhoneNumber"
import Socials from "../../components/Socials"
import Email from "../../components/Email"

export default function AboutUs() {
    const { dispatch } = useAdmin()

    const [isLoading, setIsLoading] = useState(true)

    const [phoneNums, setPhoneNums] = useState([])
    const [socials, setSocials] = useState([])
    const [emails, setEmails] = useState([])



    useEffect(() => {
        const fetchData = async () => {
            await axios.get('/admin-settings/all')
                .then((res) => {
                    setPhoneNums(res.data.adminSetting.phoneNumbers)
                    setSocials(res.data.adminSetting.socials)
                    setEmails(res.data.adminSetting.emails)
                })
                .catch((err) => {
                    dispatch({ type: 'FAILED', payload: err.response.data.error })
                    console.log(err.response.data.error)
                })
                .finally(() => {
                    setIsLoading(false)
                })
        }

        fetchData()
    }, [])






    return (
        <>
            {
                isLoading ?
                    <Loader2 />
                    :
                    <div className="about-us">
                        <PhoneNumber phoneNums={phoneNums} setPhoneNums={setPhoneNums} />
                        <Email emails={emails} setEmails={setEmails} />
                        <Socials socials={socials} setSocials={setSocials} />
                    </div>
            }
        </>
    )
}
