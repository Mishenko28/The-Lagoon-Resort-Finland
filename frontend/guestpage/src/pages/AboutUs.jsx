import { useEffect, useState } from "react"
import "./../styles/about.css"
import Loader from "../components/Loader"
import axios from "axios"
import { MapContainer, Marker, TileLayer } from "react-leaflet"
import "leaflet/dist/leaflet.css";

const AboutUs = () => {
    const [isLoading, setIsLoading] = useState(true)

    const [address, setAddress] = useState("")
    const [coordinates, setCoordinates] = useState([])
    const [emails, setEmails] = useState([])
    const [phoneNumbers, setPhoneNumbers] = useState([])
    const [socials, setSocials] = useState([])

    useEffect(() => {
        fetchAbout()
    }, [])


    const fetchAbout = async () => {
        axios.get("admin-settings/all")
            .then(res => {
                setAddress(res.data.adminSetting.address)
                setCoordinates(res.data.adminSetting.coordinates)
                setEmails(res.data.adminSetting.emails)
                setPhoneNumbers(res.data.adminSetting.phoneNumbers)
                setSocials(res.data.adminSetting.socials)
            })
            .finally(() => setIsLoading(false))
    }

    return (
        <div className="about-us">
            <div className="header-page">
                <img src="/about.png" />
                <h1>ABOUT US</h1>
                <p>Need help with your booking? Our support team is here for you! Contact us anytime for assistance.</p>
            </div>
            {isLoading ?
                <Loader />
                :
                <div className="about-us-content">
                    <h1 className="heading">The Lagoon Resort Finland Inc.</h1>
                    <h2 className="addr">We are located at {address}</h2>
                    <MapContainer
                        center={coordinates}
                        zoom={19}
                        scrollWheelZoom={false}
                    >
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker
                            position={coordinates}
                        />
                    </MapContainer>
                    <div className="contacts">
                        <h1>GET IN TOUCH</h1>
                        {phoneNumbers.length > 0 &&
                            <div className="contacts2">
                                <h2>Contact us via mobile</h2>
                                {phoneNumbers.map(item => (
                                    <div key={item._id} className="mobile-number-list">
                                        <p><i className="fa-solid fa-phone" /> {item.sim}</p>
                                        <p>{item.number}</p>
                                    </div>
                                ))}
                            </div>
                        }
                        {emails.length > 0 &&
                            <div className="contacts2">
                                <h2>Emails Us</h2>
                                {emails.map(item => (
                                    <p key={item._id} className="email"><i className="fa-solid fa-envelope" /> {item.url}</p>
                                ))}
                            </div>
                        }
                        {socials.length > 0 &&
                            <div className="contacts2">
                                <h2>Follow us on social media</h2>
                                <div className="links">
                                    {socials.map(item => (
                                        <a href={item.link}>
                                            <i className={`fa-brands fa-${item.app}`} />
                                        </a>
                                    ))}
                                </div>
                            </div>
                        }
                    </div>
                </div>
            }
        </div>
    )
}

export default AboutUs