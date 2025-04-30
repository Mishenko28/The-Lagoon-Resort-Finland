import { useState, useRef, useEffect } from 'react'
import Loader2 from '../../components/Loader2'
import useConvertBase64 from '../../hooks/useConvertBase64'
import axios from 'axios'
import useAdmin from '../../hooks/useAdmin'
import EditPhoto from '../../components/EditPhoto'
import AddRoomSubImage from '../../components/AddRoomSubImage'
import EditRoomSubImage from '../../components/EditRoomSubImage'
import EditRoomMainImage from '../../components/EditRoomMainImage'
import { motion, AnimatePresence } from 'framer-motion'
import { useLocation } from 'react-router-dom'

export default function Gallery() {
    const { dispatch } = useAdmin()
    const [base64, convertToBase64] = useConvertBase64("")
    const location = useLocation()

    const [isLoading, setIsLoading] = useState(true)
    const [photos, setPhotos] = useState([])
    const [roomTypes, setRoomTypes] = useState([])

    const [newPhoto, setNewPhoto] = useState({
        caption: '',
        img: base64,
        hide: false
    })
    const [newPhotoLoading, setNewPhotoLoading] = useState(false)

    const [sort, setSort] = useState('newest')
    const [sortTogg, setSortTogg] = useState(false)
    const sortRef = useRef()
    const sortSelectionRef = useRef()

    const [editPhoto, setEditPhoto] = useState(null)
    const [isAddingSubImg, setIsAddingSubImg] = useState(null)
    const [editingSubImg, setEditingSubImg] = useState(null)
    const [isEditingMainImg, setIsEditingMainImg] = useState(null)

    useEffect(() => {
        if (location.hash) {
            const element = document.getElementById(location.hash.substring(1));
            if (element) {
                element.scrollIntoView({ behavior: "smooth" });
            }
        }
    }, [isLoading])

    useEffect(() => {
        const handleClick = e => {
            if (sortRef.current && !sortRef.current.contains(e.target) && sortSelectionRef.current && !sortSelectionRef.current.contains(e.target)) {
                setSortTogg(false)
            }
        }

        document.addEventListener('click', handleClick)

        return () => {
            document.removeEventListener('click', handleClick)
        }
    }, [])

    useEffect(() => {
        setNewPhoto(prev => ({ ...prev, img: base64 }))
    }, [base64])

    useEffect(() => {
        const fetchData = async () => {
            await axios.get('gallery/all')
                .then((res) => {
                    setPhotos(res.data.pictures.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)))
                })
                .catch((err) => {
                    dispatch({ type: 'FAILED', payload: err.response.data.error })
                        .log(err.response.data.error)
                })

            await axios.get('/room-type/all')
                .then((res) => {
                    setRoomTypes(res.data.roomTypes)
                })
                .catch((err) => {
                    dispatch({ type: 'FAILED', payload: err.response.data.error })
                })

            setIsLoading(false)
        }

        fetchData()
    }, [])

    useEffect(() => {
        const sortedPhotos = [...photos].sort((a, b) => {
            if (sort === "newest") {
                return new Date(b.createdAt) - new Date(a.createdAt)
            } else if (sort === "oldest") {
                return new Date(a.createdAt) - new Date(b.createdAt)
            }
            return 0
        })

        setPhotos(sortedPhotos)
    }, [sort])

    const handleClear = () => {
        setNewPhoto({
            caption: '',
            img: "",
            hide: false
        })
    }

    const submitNewPhoto = async () => {
        if (!newPhoto.caption.trim() || !newPhoto.img) {
            dispatch({ type: 'FAILED', payload: 'Please fill in all fields' })
            setNewPhotoLoading(false)
            return

        }

        setNewPhotoLoading(true)

        await axios.post('gallery/add', { ...newPhoto })
            .then((res) => {
                setPhotos(prev => sort === 'newest' ? [res.data.picture, ...prev] : [...prev, res.data.picture])
                dispatch({ type: 'SUCCESS', payload: true })
                handleClear()
            })
            .catch((err) => {
                dispatch({ type: 'FAILED', payload: err.response.data.error })
                    .log(err.response.data.error)
            })

        setNewPhotoLoading(false)
    }

    return (
        <>
            {isLoading ?
                <Loader2 />
                :
                <>
                    <div className='gallery-add-cont'>
                        {newPhotoLoading && <div className='loader-line'></div>}
                        <h1>ADD NEW PHOTO:</h1>
                        <div className='gallery-add'>
                            <textarea onChange={(e) => e.target.value.length <= 40 && setNewPhoto(prev => ({ ...prev, caption: e.target.value }))} value={newPhoto.caption} rows={6} placeholder='caption here'></textarea>
                            {newPhoto.img && <img style={newPhoto.img ? null : { height: 0 }} src={newPhoto.img} />}
                        </div>
                        <input type="file" accept='png, jpeg, jpg' onChange={(e) => convertToBase64(e.target.files[0])} />
                        <div className='hide-wrapper'>
                            <h2>Hide:</h2>
                            <input checked={newPhoto.hide} type="checkbox" onChange={() => setNewPhoto(prev => ({ ...prev, hide: !prev.hide }))} />
                        </div>
                        <div className='bttns'>
                            <button className='submit' onClick={submitNewPhoto}>Add</button>
                            <button className='cancel' onClick={handleClear}>Clear</button>
                        </div>
                    </div>
                    <div className="button-header">
                        <div className='sort-wrapper'>
                            <button ref={sortRef} onClick={() => setSortTogg(!sortTogg)}><i className="fa-solid fa-sort" />Sort Photos</button>
                            {sortTogg &&
                                <div ref={sortSelectionRef} className='selections'>
                                    <h1 onClick={() => setSort('newest')}>{sort === 'newest' && <i className="fa-solid fa-caret-right" />}Newest</h1>
                                    <h1 onClick={() => setSort('oldest')}>{sort === 'oldest' && <i className="fa-solid fa-caret-right" />}Oldest</h1>
                                </div>
                            }
                        </div>
                    </div>
                    <div className='gallery-cont'>
                        <div className='gallery-header'>
                            <h1>Gallery</h1>
                        </div>
                        <div className='pics'>
                            <AnimatePresence mode='sync'>
                                {photos.map(photo => (
                                    <motion.div
                                        layout
                                        initial={{ opacity: 0.5, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                        transition={{ duration: 0.3 }}
                                        key={photo._id}
                                        className='photo'
                                        onClick={() => setEditPhoto(photo)}
                                    >
                                        <img src={photo.img} />
                                        <p>{photo.caption}</p>
                                        {photo.hide && <h2 className='hide'>hidden</h2>}
                                    </motion.div>
                                ))}
                                {photos.length === 0 &&
                                    <h3>No Photos</h3>
                                }
                            </AnimatePresence>
                        </div>
                    </div>
                    <div className='room-gallery' id='room-types'>
                        <div className='gallery-header'>
                            <h1>ROOM TYPES IMAGES</h1>
                        </div>
                        <div className='pics'>
                            {roomTypes.map((roomType, i) => (
                                <div key={i} className='room-typess'>
                                    <h1>{roomType.name} ROOMS</h1>
                                    <div className='room-pics'>
                                        <p>main</p>
                                        <img onClick={() => setIsEditingMainImg(roomType)} src={roomType.img} />
                                        <AnimatePresence mode='sync'>
                                            {roomType.subImg.map((img, i) => (
                                                <motion.img
                                                    layout
                                                    initial={{ opacity: 0.5, scale: 0.9 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    exit={{ opacity: 0, scale: 0.8 }}
                                                    transition={{ duration: 0.3 }}
                                                    onClick={() => setEditingSubImg({ ...roomType, index: i })}
                                                    key={img._id}
                                                    src={img.url}
                                                />
                                            ))}
                                            <i key="add" onClick={() => setIsAddingSubImg(roomType)} className="fa-solid fa-plus" />
                                        </AnimatePresence>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    {isEditingMainImg && <EditRoomMainImage isEditingMainImg={isEditingMainImg} setIsEditingMainImg={setIsEditingMainImg} setRoomTypes={setRoomTypes} />}
                    {editingSubImg && <EditRoomSubImage editingSubImg={editingSubImg} setEditingSubImg={setEditingSubImg} setRoomTypes={setRoomTypes} />}
                    {isAddingSubImg && <AddRoomSubImage isAddingSubImg={isAddingSubImg} setIsAddingSubImg={setIsAddingSubImg} setRoomTypes={setRoomTypes} />}
                    {editPhoto && <EditPhoto editPhoto={editPhoto} setEditPhoto={setEditPhoto} setPhotos={setPhotos} />}
                </>
            }
        </>
    )
}
