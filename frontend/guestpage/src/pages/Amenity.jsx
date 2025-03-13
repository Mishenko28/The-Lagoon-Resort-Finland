import { useState, useEffect } from "react"
import "../styles/amenity.css"
import axios from "axios"
import Loader from "../components/Loader"



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
                <img src="/amenityBG.jpeg" />
                <h1>AMENITIES</h1>
                <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Cupiditate accusantium iste reprehenderit molestias sint qui obcaecati ut?</p>
            </div>
            {isLoading ?
                <Loader />
                :
                <div className="amenities-wrapper">
                    {amenities.filter(amenity => amenity.active).map(amenity => (
                        <div className="ame" key={amenity._id}>
                            <img src={amenity.img} />
                            <div>
                                <h1>{amenity.name}</h1>
                                <p>{amenity.caption}</p>
                            </div>
                        </div>
                    ))}
                </div>
            }
        </div>
    )
}

export default Amenity