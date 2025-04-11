import { useEffect, useState } from "react"
import Loader2 from "../../components/Loader2"
import axios from 'axios'
import useAdmin from '../../hooks/useAdmin'

import PhoneNumber from "../../components/PhoneNumber"
import Socials from "../../components/Socials"
import Email from "../../components/Email"
import ResortMap from "../../components/ResortMap"

export default function AboutUs() {
    const { dispatch } = useAdmin()

    const [isLoading, setIsLoading] = useState(true)

    const [phoneNums, setPhoneNums] = useState([])
    const [socials, setSocials] = useState([])
    const [emails, setEmails] = useState([])
    const [coordinates, setCoordinates] = useState([14.849517906581863, 120.25145817187875])
    const [address, setAddress] = useState("62 Baloy Long Beach Rd, Olongapo, 2200 Zambales")


    useEffect(() => {
        const fetchData = async () => {
            await axios.get('/admin-settings/all')
                .then((res) => {
                    setPhoneNums(res.data.adminSetting.phoneNumbers)
                    setSocials(res.data.adminSetting.socials)
                    setEmails(res.data.adminSetting.emails)
                    setAddress(res.data.adminSetting.address)
                    setCoordinates(res.data.adminSetting.coordinates)
                })
                .catch((err) => {
                    dispatch({ type: 'FAILED', payload: err.response.data.error })
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
                        <ResortMap coordinates={coordinates} setCoordinates={setCoordinates} address={address} setAddress={setAddress} />
                    </div>
            }
        </>
    )
}
