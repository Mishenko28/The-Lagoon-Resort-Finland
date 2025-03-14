import axios from "axios"
import { useEffect, useState } from "react"
import Loader from "../components/Loader"
import "../styles/accommodation.css"
import { motion } from "framer-motion"

const Accommodation = () => {
    const [isLoading, setIsLoading] = useState(true)
    const [rooms, setRooms] = useState([])
    const [roomTypes, setRoomTypes] = useState([])


    useEffect(() => {
        fetchRoomTypes()
    }, [])

    const fetchRooms = async () => {
        axios.get('room/all')
            .then(res => {
                setRooms(res.data.rooms)
            })
            .finally(() => setIsLoading(false))
    }

    const fetchRoomTypes = async () => {
        axios.get('room-type/all')
            .then(res => {
                setRoomTypes(res.data.roomTypes)
            })
            .finally(() => fetchRooms())
    }

    return (
        <div className="accommodation">
            <div className="header-page">
                <img src="accommodationBG.jpg" />
                <div>
                    <h1>ROOMS &</h1>
                    <h1>ACCOMMODATION</h1>
                </div>
                <p>Experience the beauty of nature in our cozy rooms</p>
            </div>
            {isLoading ?
                <Loader />
                :
                <div className="roomTypes">
                    {roomTypes.map(roomType => rooms.some(room => room.roomType === roomType.name && room.active) && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ duration: 1 }}
                            viewport={{ once: 1, amount: 0.6 }}
                            className="roomType"
                        >
                            <div className="part1">
                                <img src={roomType.img} />
                                <h1>₱{roomType.rate} / Night</h1>
                            </div>
                            <div className="part2">
                                <h2>{roomType.name} ROOM</h2>
                                <p>{roomType.caption}</p>
                                <button>BOOK NOW</button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            }
        </div>
    )
}

export default Accommodation