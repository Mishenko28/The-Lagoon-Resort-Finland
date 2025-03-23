import React from 'react'
import { useState, useEffect, useRef } from 'react'

const AvailableRooms = ({ availableRooms }) => {
    const [showAvailableRooms, setShowAvailableRooms] = useState(false)
    const btnRef = useRef(null)
    const contentRef = useRef(null)

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (!contentRef.current.contains(e.target) && !btnRef.current.contains(e.target)) {
                setShowAvailableRooms(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)

        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [])



    return (
        <div className="available-rooms">
            <p ref={btnRef} onClick={() => setShowAvailableRooms(!showAvailableRooms)}>
                Available Rooms
                {showAvailableRooms ?
                    <i className="fa-solid fa-angle-up" />
                    :
                    <i className="fa-solid fa-angle-down" />
                }
            </p>
            {showAvailableRooms &&
                <div ref={contentRef} className="content">
                    {availableRooms.map((room, i) => (
                        <h2 key={i}><b>{room.roomType}</b> ({room.rooms.reduce((available, room) => room.available ? available + 1 : available, 0)} rooms)</h2>
                    ))}
                </div>
            }
        </div>
    )
}

export default AvailableRooms