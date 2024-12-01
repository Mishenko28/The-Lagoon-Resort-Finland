import { useState, useRef, useEffect } from 'react'
import Loader2 from '../../components/Loader2'
import useConvertBase64 from '../../hooks/useConvertBase64'
import axios from 'axios'
import useAdmin from '../../hooks/useAdmin'
import EditPhoto from '../../components/EditPhoto'

export default function Gallery() {
    const { dispatch } = useAdmin()
    const [base64, convertToBase64] = useConvertBase64("")

    const [isLoading, setIsLoading] = useState(true)
    const [photos, setPhotos] = useState([])

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
                    console.log(err.response.data.error)
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
                console.log(err.response.data.error)
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
                        <h1>ADD NEW:</h1>
                        <div className='gallery-add'>
                            <textarea onChange={(e) => setNewPhoto(prev => ({ ...prev, caption: e.target.value }))} value={newPhoto.caption} rows={6} placeholder='caption here'></textarea>
                            <img style={newPhoto.img ? null : { height: 0 }} src={newPhoto.img} />
                        </div>
                        <input type="file" accept='png, jpeg, jpg' onChange={(e) => convertToBase64(e.target.files[0])} />
                        <div className='hide-wrapper'>
                            <h2>Hide:</h2>
                            <input checked={newPhoto.hide} type="checkbox" onChange={() => setNewPhoto(prev => ({ ...prev, hide: !prev.hide }))} />
                        </div>
                        <div className='bttns'>
                            <button onClick={submitNewPhoto}>add</button>
                            <button onClick={handleClear}>clear</button>
                        </div>
                    </div>
                    <div className="config-header">
                        <div className='sort-wrapper'>
                            <button ref={sortRef} onClick={() => setSortTogg(!sortTogg)}><i className="fa-solid fa-sort" />Sort</button>
                            {sortTogg &&
                                <div ref={sortSelectionRef} className='selections'>
                                    <h1 onClick={() => setSort('newest')}>{sort === 'newest' && <i className="fa-solid fa-caret-right" />}Newest</h1>
                                    <h1 onClick={() => setSort('oldest')}>{sort === 'oldest' && <i className="fa-solid fa-caret-right" />}Oldest</h1>
                                </div>
                            }
                        </div>
                    </div>
                    <div className='gallery-cont'>
                        {photos.map(photo => (
                            <div key={photo._id} onClick={() => setEditPhoto(photo)} className='photo'>
                                <img src={photo.img} />
                                <hr />
                                <p>{photo.caption}</p>
                                {photo.hide && <h2 className='hide'>hidden</h2>}
                            </div>
                        ))}
                    </div>
                    {editPhoto && <EditPhoto editPhoto={editPhoto} setEditPhoto={setEditPhoto} setPhotos={setPhotos} />}
                </>
            }
        </>
    )
}
