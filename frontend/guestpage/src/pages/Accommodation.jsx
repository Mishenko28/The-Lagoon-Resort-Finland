import axios from "axios"
import { useEffect, useState } from "react"
import Loader from "../components/Loader"
import "../styles/accommodation.css"
import { motion } from "framer-motion"
import SubImg from "../components/SubImg"
import { useNavigate } from "react-router-dom"

const Accommodation = () => {
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(true)
    const [rooms, setRooms] = useState([])
    const [roomTypes, setRoomTypes] = useState([])
    const [subImgToShow, setSubImgToShow] = useState(null)

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
                <img src="accomm.jpg" />
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
                            viewport={{ once: 1, amount: 0.4 }}
                            className="roomType"
                            key={roomType._id}
                        >
                            <div className="part1">
                                <img src={roomType.img} />
                                <h1>₱{roomType.rate.toLocaleString()} / Night</h1>
                                {roomType.subImg.length > 0 &&
                                    <div onClick={() => setSubImgToShow(roomType)} className="subImg-icon">
                                        <i className="fa-solid fa-image" />
                                        <p>{roomType.subImg.length}</p>
                                    </div>
                                }
                            </div>
                            <div className="part2">
                                <h2>{roomType.name} ROOM</h2>
                                <p>{roomType.caption}</p>
                                <button onClick={() => navigate(`/booking?select=${roomType.name}`)}>BOOK NOW</button>
                            </div>
                        </motion.div>
                    ))}
                    {subImgToShow && <SubImg subImgToShow={subImgToShow} setSubImgToShow={setSubImgToShow} />}
                </div>
            }
        </div>
    )
}

export default Accommodation