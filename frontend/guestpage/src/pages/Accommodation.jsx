import axios from "axios"
import { useEffect, useState, useRef } from "react"
import Loader from "../components/Loader"
import "../styles/accommodation.css"
import SubImg from "../components/SubImg"

const Accommodation = () => {
    const [isLoading, setIsLoading] = useState(true)
    const [rooms, setRooms] = useState(null)
    const [roomTypes, setRoomTypes] = useState(null)
    const sliderRefs = useRef({})
    const [activeButtons, setActiveButtons] = useState([])
    const [subImgToShow, setSubImgToShow] = useState(null)

    useEffect(() => {
        fetchRoomTypes()
    }, [])

    useEffect(() => {
        if (!rooms || !roomTypes) return

        roomTypes.map(roomType => {
            rooms.filter(room => room.roomType === roomType).map((room, i) => {
                if (i !== 0) return
                if (activeButtons.some(button => button.roomNo === room.roomNo)) return

                setActiveButtons(prev => [...prev, {
                    roomType,
                    roomNo: room.roomNo
                }])
            })
        })

    }, [roomTypes, rooms])

    useEffect(() => {
        if (!rooms || !roomTypes) return

        const handleScroll = (roomType) => {
            const slider = sliderRefs.current[roomType]
            const roomsInSlider = rooms.filter(room => room.roomType === roomType)
            let closestRoom = roomsInSlider[0]

            roomsInSlider.forEach(room => {
                const roomElement = document.getElementById(room.roomNo)
                const offsetLeft = roomElement.offsetLeft
                const distance = Math.abs(slider.scrollLeft - offsetLeft)

                if (distance < Math.abs(slider.scrollLeft - document.getElementById(closestRoom.roomNo).offsetLeft)) {
                    closestRoom = room
                }
            })

            setActiveButtons(prev => prev.filter(button => button.roomType !== roomType))
            setActiveButtons(prev => [...prev, { roomType, roomNo: closestRoom.roomNo }])
        }

        roomTypes.forEach(roomType => {
            const slider = sliderRefs.current[roomType]
            if (slider) {
                slider.addEventListener('scroll', () => handleScroll(roomType))
            }
        })

        return () => {
            roomTypes.forEach(roomType => {
                const slider = sliderRefs.current[roomType]
                if (slider) {
                    slider.removeEventListener('scroll', () => handleScroll(roomType))
                }
            })
        }
    }, [roomTypes, rooms])

    const fetchRooms = async () => {
        axios.get('room/all')
            .then(res => {
                setRooms(res.data.rooms)
            })
            .finally(() => setIsLoading(false))
    }

    const fetchRoomTypes = async () => {
        axios.get('admin-settings/all')
            .then(res => {
                setRoomTypes(res.data.adminSetting.roomTypes)
            })
            .finally(() => fetchRooms())
    }

    const scrollToRoom = (roomNo, roomType) => {
        if (sliderRefs.current[roomType]) {
            const slider = sliderRefs.current[roomType]
            const targetRoom = document.getElementById(roomNo)

            if (targetRoom) {
                const offsetLeft = targetRoom.offsetLeft
                slider.scrollTo({ left: offsetLeft, behavior: "smooth" })
            }
        }
    }

    if (isLoading) return <Loader />

    return (
        <div className="accommodation">
            {subImgToShow && <SubImg subImgToShow={subImgToShow} setSubImgToShow={setSubImgToShow} />}
            {roomTypes.map(roomType => (
                <div className="room-type" key={roomType}>
                    <h1>{roomType} ROOMS</h1>
                    <div className="room-nav">
                        {rooms.filter(room => room.roomType === roomType).map(room => (
                            <button className={activeButtons.some(button => button.roomNo === room.roomNo) ? 'active' : null} onClick={() => scrollToRoom(room.roomNo, roomType)} key={room._id}>{room.roomNo}</button>
                        ))}
                    </div>
                    <div ref={(el) => (sliderRefs.current[roomType] = el)} className="slider">
                        {rooms.filter(room => room.roomType === roomType).map(room => (
                            <div id={room.roomNo} key={room._id} className="room">
                                <div className="img-wrapper">
                                    <img src={room.img} />
                                    {room.subImg.length > 0 &&
                                        <div onClick={() => setSubImgToShow({ roomNo: room.roomNo, images: room.subImg })} className="room-icon">
                                            <i className="fa-solid fa-image" />
                                            <p>{room.subImg.length}</p>
                                        </div>
                                    }
                                </div>
                                <div className="room-info">
                                    <h2>ROOM {room.roomNo}</h2>
                                    <h3>• maximum of {room.maxPerson} persons</h3>
                                    <h3>{room.caption}</h3>
                                    <div className="room-footer">
                                        <h4>₱{room.rate}</h4>
                                        <button>BOOK NOW</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    )
}

export default Accommodation