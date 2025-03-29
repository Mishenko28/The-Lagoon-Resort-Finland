import { MapContainer, Marker, TileLayer } from 'react-leaflet'
import "leaflet/dist/leaflet.css";
import axios from 'axios'
import { useState } from 'react';
import useAdmin from '../hooks/useAdmin'

const ResortMap = ({ coordinates, setCoordinates, address, setAddress }) => {
    const { dispatch } = useAdmin()
    const [isLoading, setIsLoading] = useState(false)

    const [isEditing, setIsEditing] = useState(false)
    const [newAddress, setNewAddress] = useState("")
    const [newCoordinates, setNewCoordinates] = useState([])

    const handleIsEditingTrue = () => {
        setIsEditing(true)
        setNewAddress(address)
        setNewCoordinates(coordinates)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)

        await axios.patch('/admin-settings/update', { address: newAddress, coordinates: newCoordinates })
            .then((res) => {
                setAddress(res.data.adminSetting.address)
                setCoordinates(res.data.adminSetting.coordinates)
                setIsEditing(false)
            })
            .catch((err) => {
                dispatch({ type: 'FAILED', payload: err.response.data.error })
                console.log(err.response.data.error)
            })
            .finally(() => setIsLoading(false))
    }

    return (
        <div className="map-container">
            {isLoading && <div className='loader-line'></div>}
            <div className='bttns'>
                {isEditing ?
                    <i onClick={() => setIsEditing(false)} className='fa-solid fa-square-xmark' />
                    :
                    <i onClick={handleIsEditingTrue} className='fa-solid fa-pen-to-square' />
                }
            </div>
            <form onSubmit={handleSubmit} className='map-inputs'>
                <div className='address'>
                    <h1>Address:</h1>
                    <input disabled={!isEditing} type="text" value={isEditing ? newAddress : address} onChange={e => setNewAddress(e.target.value)} />
                </div>
                <hr />
                <div className='coords'>
                    <h1>Coordinates:</h1>
                    <div className='latitude'>
                        <label>Latitude / Y axis / Vertical</label>
                        <input disabled={!isEditing} type="number" value={isEditing ? newCoordinates[0] : coordinates[0]} onChange={e => setNewCoordinates(prev => prev.map((coord, i) => i === 0 ? e.target.value : coord))} />
                    </div>
                    <div className='longitude'>
                        <label>Longitude / X axis / Horizontal</label>
                        <input disabled={!isEditing} type="number" value={isEditing ? newCoordinates[1] : coordinates[1]} onChange={e => setNewCoordinates(prev => prev.map((coord, i) => i === 1 ? e.target.value : coord))} />
                    </div>
                </div>
                {isEditing &&
                    <div className='bttns-down'>
                        <button type='submit' disabled={isLoading}>Save</button>
                        <button type='button' onClick={() => setIsEditing(false)}>Cancel</button>
                    </div>
                }
            </form>
            <hr />
            <div className='map'>
                <h1>Map:</h1>
                <MapContainer
                    center={isEditing ? newCoordinates : coordinates}
                    zoom={19}
                    scrollWheelZoom={false}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker
                        position={isEditing ? newCoordinates : coordinates}
                    />
                </MapContainer>
            </div>
        </div>
    )
}

export default ResortMap