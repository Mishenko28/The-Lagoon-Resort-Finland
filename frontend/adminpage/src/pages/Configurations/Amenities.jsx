import Loader2 from "../../components/Loader2"
import useAdmin from "../../hooks/useAdmin"
import { useState, useRef, useEffect } from "react"
import axios from "axios"
import AddAmenity from "../../components/AddAmenity"
import EditAmenity from "../../components/EditAmenity"
import { motion, AnimatePresence } from 'framer-motion'

export default function Amenities() {
    const { dispatch } = useAdmin()

    const [amenities, setAmenities] = useState([])

    const [isLoading, setIsLoading] = useState(true)

    const [isCard, setIsCard] = useState(true)
    const [sort, setSort] = useState({
        type: 'name',
        order: 'asc'
    })
    const [sortTogg, setSortTogg] = useState(false)
    const sortRef = useRef()
    const sortSelectionRef = useRef()

    const [addAmenityTogg, setAddAmenityTogg] = useState(false)
    const [editAmenity, setEditAmenity] = useState(null)

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
        const sortedAmenities = [...amenities].sort((a, b) => {
            if (sort.type === "name") {
                return sort.order === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
            } else if (sort.type === "active") {
                return sort.order === "asc" ? b.active - a.active : a.active - b.active
            } else if (sort.type === "created") {
                return sort.order === "asc" ? new Date(b.createdAt) - new Date(a.createdAt) : new Date(a.createdAt) - new Date(b.createdAt)
            }
            return 0
        })

        if (JSON.stringify(sortedAmenities) === JSON.stringify(amenities)) {
            return
        }

        setAmenities(sortedAmenities)
    }, [sort, amenities])

    useEffect(() => {
        const fetchData = async () => {
            await axios.get('/amenity/all')
                .then((res) => {
                    setAmenities(res.data.amenities.sort((a, b) => a.name.localeCompare(b.name)))
                })
                .catch((err) => {
                    dispatch({ type: 'FAILED', payload: err.response.data.error })
                })

            setIsLoading(false)
        }
        fetchData()
    }, [])

    return (
        <>
            {isLoading ?
                <Loader2 />
                :
                <>
                    <div className="button-header">
                        <button onClick={() => setAddAmenityTogg(true)}><i className="fa-solid fa-plus" />Add</button>
                        <div className='sort-wrapper'>
                            <button ref={sortRef} onClick={() => setSortTogg(!sortTogg)}><i className="fa-solid fa-sort" />Sort</button>
                            {sortTogg &&
                                <div ref={sortSelectionRef} className='selections'>
                                    <h1 onClick={() => setSort(prev => ({ ...prev, type: "name" }))}>{sort.type == "name" && <i className="fa-solid fa-caret-right" />}Name</h1>
                                    <h1 onClick={() => setSort(prev => ({ ...prev, type: "active" }))}>{sort.type == "active" && <i className="fa-solid fa-caret-right" />}Active</h1>
                                    <h1 onClick={() => setSort(prev => ({ ...prev, type: "created" }))}>{sort.type == "created" && <i className="fa-solid fa-caret-right" />}Created</h1>
                                    <hr />
                                    <h1 onClick={() => setSort(prev => ({ ...prev, order: "asc" }))}>{sort.order == "asc" && <i className="fa-solid fa-caret-right" />}Ascending</h1>
                                    <h1 onClick={() => setSort(prev => ({ ...prev, order: "des" }))}>{sort.order == "des" && <i className="fa-solid fa-caret-right" />}Descending</h1>
                                </div>
                            }
                        </div>
                    </div>
                    <div className='infos'>
                        <h1>Total: <b>{amenities.length}</b></h1>
                    </div>
                    <div className='card-and-table-togg-cont'>
                        <button onClick={() => setIsCard(true)} style={isCard ? { backgroundColor: "var(--primary)", color: "#fff" } : null}>Card</button>
                        <button onClick={() => setIsCard(false)} style={!isCard ? { backgroundColor: "var(--primary)", color: "#fff" } : null}>Table</button>
                    </div>
                    {isCard ?
                        <div className="amenity-card-wrapper">
                            <AnimatePresence mode="sync">
                                {amenities.map(amenity => (
                                    <motion.div
                                        layout
                                        initial={{ opacity: 0.5, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                        transition={{ duration: 0.3 }}
                                        key={amenity._id} onClick={() => setEditAmenity(amenity)}
                                        className='amenity-card'
                                    >
                                        <h1>{amenity.name}</h1>
                                        <img src={amenity.img} />
                                        <h5>{amenity.caption}</h5>
                                        {!amenity.active && <span>not active</span>}
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                        :
                        <div className="amenity-table-cont">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Image</th>
                                        <th>Caption</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <AnimatePresence mode='sync'>
                                        {amenities.map(amenity => (
                                            <motion.tr
                                                layout
                                                initial={{ opacity: 0.5, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.8 }}
                                                transition={{ duration: 0.3 }}
                                                key={amenity._id}
                                                onClick={() => setEditAmenity(amenity)}
                                            >
                                                <td>
                                                    {amenity.name}
                                                    {!amenity.active && <span>not active</span>}
                                                </td>
                                                <td><img src={amenity.img} /></td>
                                                <td>{amenity.caption}</td>
                                            </motion.tr>
                                        ))}
                                    </AnimatePresence>
                                </tbody>
                            </table>
                        </div>
                    }
                </>
            }
            {addAmenityTogg && <AddAmenity setAmenities={setAmenities} setAddAmenityTogg={setAddAmenityTogg} />}
            {editAmenity && <EditAmenity editAmenity={editAmenity} setEditAmenity={setEditAmenity} setAmenities={setAmenities} />}
        </>
    )
}
