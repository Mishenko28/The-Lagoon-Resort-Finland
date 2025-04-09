import { useEffect, useState } from "react"
import "../styles/home.css"
import Loader from "../components/Loader"
import axios from "axios"
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"

const maskName = (name) => {
    return name
        .split(' ')
        .map(word => word[0] + '*'.repeat(word.length - 1))
        .join(' ')
}

const Home = () => {
    const [isLoading, setIsLoading] = useState(true)
    const navigate = useNavigate()

    const [roomTypes, setRoomTypes] = useState([])
    const [rooms, setRooms] = useState([])

    const [feedbacks, setFeedbacks] = useState([])

    useEffect(() => {
        fetchRoomTypes()
    }, [])

    const fetchRoomTypes = async () => {
        axios.get('room-type/all')
            .then(res => {
                setRoomTypes(res.data.roomTypes)
            })
            .finally(() => setIsLoading(false))

        axios.get('room/all')
            .then(res => {
                setRooms(res.data.rooms)
            })
        axios.get('feedback/all')
            .then(res => {
                setFeedbacks(res.data)
            })
    }
    console.log(feedbacks)
    return (
        <div className="home-page">
            <div className="header-page">
                <img src="/galleryBG.jpg" />
                <h1>THE LAGOON RESORT FINLAND INC.</h1>
                <p>Escape the ordinary and experience a relaxing getaway surrounded by nature and comfort. A perfect destination for those seeking peace, adventure, or quality time with family and friends.</p>
            </div>
            {isLoading ?
                <Loader />
                :
                <>
                    <div className="accomms">
                        <h1>OUR ROOMS</h1>
                        <div className="imgs">
                            {roomTypes.map((roomType, i) => rooms.some(room => room.roomType === roomType.name && room.active) && (
                                <motion.img
                                    whileHover={{ scale: 1.05, transition: { duration: 0.1 } }}
                                    initial={{ translateY: -50, scale: 0.5 }}
                                    animate={{ translateY: 0, scale: 1 }}
                                    transition={{ duration: 0.2 * (i + 1) }}
                                    src={roomType.img}
                                    key={roomType._id}
                                />
                            ))}
                        </div>
                        <button onClick={() => navigate('/booking')}>BOOK NOW</button>
                    </div>
                    <div className="amenity-wrapper">
                        <motion.div
                            whileHover={{ scale: 1.05, transition: { duration: 0.1 } }}
                            initial={{ translateY: 100 }}
                            whileInView={{ translateY: 0 }}
                            transition={{ duration: 0.1 }}
                            viewport={{ amount: 0.8, once: 1 }}
                            className="inclus"
                        >
                            <img src="/inclusions/aircon.png" />
                            <h1>Air-conditioned Room</h1>
                        </motion.div>
                        <motion.div
                            whileHover={{ scale: 1.05, transition: { duration: 0.1 } }}
                            initial={{ translateY: 100 }}
                            whileInView={{ translateY: 0 }}
                            transition={{ duration: 0.25 }}
                            viewport={{ amount: 0.8, once: 1 }}
                            className="inclus"
                        >
                            <img src="/inclusions/wifi.png" />
                            <h1>Free Wifi</h1>
                        </motion.div>
                        <motion.div
                            whileHover={{ scale: 1.05, transition: { duration: 0.1 } }}
                            initial={{ translateY: 100 }}
                            whileInView={{ translateY: 0 }}
                            transition={{ duration: 0.4 }}
                            viewport={{ amount: 0.8, once: 1 }}
                            className="inclus"
                        >
                            <img src="/inclusions/shower.png" />
                            <h1>Hot & Cold Shower</h1>
                        </motion.div>
                        <motion.div
                            whileHover={{ scale: 1.05, transition: { duration: 0.1 } }}
                            initial={{ translateY: 100 }}
                            whileInView={{ translateY: 0 }}
                            transition={{ duration: 0.55 }}
                            viewport={{ amount: 0.8, once: 1 }}
                            className="inclus"
                        >
                            <img src="/inclusions/pawprint.png" />
                            <h1>Pet Friendly</h1>
                        </motion.div>
                        <motion.div
                            whileHover={{ scale: 1.05, transition: { duration: 0.1 } }}
                            initial={{ translateY: 100 }}
                            whileInView={{ translateY: 0 }}
                            transition={{ duration: 0.7 }}
                            viewport={{ amount: 0.8, once: 1 }}
                            className="inclus"
                        >
                            <img src="/inclusions/pool.png" />
                            <h1>Swimming Pool</h1>
                        </motion.div>
                        <motion.div
                            whileHover={{ scale: 1.05, transition: { duration: 0.1 } }}
                            initial={{ translateY: 100 }}
                            whileInView={{ translateY: 0 }}
                            transition={{ duration: 0.85 }}
                            viewport={{ amount: 0.8, once: 1 }}
                            className="inclus"
                        >
                            <img src="/inclusions/beach-umbrella.png" />
                            <h1>Access to Beach</h1>
                        </motion.div>
                    </div>
                    <div className="testimonials">
                        <h1>Testimonials</h1>
                        <div className="testi-wrapper">
                            {feedbacks.map(feedback => (
                                <div key={feedback._id} className="testi">
                                    <img className="quote" src="/inclusions/quote.png" />
                                    <img className="pic" src={feedback.user.img} />
                                    {feedback.anonymous ?
                                        <h2>{maskName(feedback.user.name)}</h2>
                                        :
                                        <h2>{feedback.user.name}</h2>
                                    }
                                    <p>{feedback.feedback}</p>
                                    <div className="stars">{Array.from({ length: 5 }, (_, i) => <i key={i} style={feedback.star > i ? { color: "var(--gold)" } : null} className="fa-solid fa-star" />)}</div>
                                </div>
                            ))}
                        </div>

                    </div>
                </>
            }
        </div>
    )
}

export default Home