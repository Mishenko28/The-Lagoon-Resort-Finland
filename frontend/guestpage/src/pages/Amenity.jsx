import { useState, useEffect } from "react"
import "../styles/amenity.css"
import axios from "axios"
import Loader from "../components/Loader"
import { motion } from "framer-motion"

const Amenity = () => {
    const [isLoading, setIsLoading] = useState(true)

    const [amenities, setAmenities] = useState([])

    useEffect(() => {
        fetchAmenities()
    }, [])

    const fetchAmenities = async () => {
        axios.get('amenity/all')
            .then(res => {
                setAmenities(res.data.amenities)
            })
            .finally(() => setIsLoading(false))
    }

    return (
        <div className="amenity">
            <div className="header-page">
                <img src="/amenity.png" />
                <h1>AMENITIES</h1>
                <p>Enjoy a stay filled with comfort and convenience! Our thoughtfully designed amenities ensure a relaxing and memorable experience from the moment you arrive. Sit back, unwind, and make the most of your stay.</p>
            </div>
            {isLoading ?
                <Loader />
                :
                <div className="amenities-wrapper">
                    {amenities.filter(amenity => amenity.active).map(amenity => (
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ duration: 1 }}
                            viewport={{ once: 1, amount: 0.4 }}
                            className="ame"
                            key={amenity._id}
                        >
                            <img src={amenity.img} />
                            <div>
                                <h1>{amenity.name}</h1>
                                <p>{amenity.caption}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            }
        </div>
    )
}

export default Amenity