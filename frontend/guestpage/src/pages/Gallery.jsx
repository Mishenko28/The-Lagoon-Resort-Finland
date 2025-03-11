import { useEffect, useState } from "react"
import Loader from "../components/Loader"
import axios from "axios"
import "../styles/gallery.css"




const Gallery = () => {
    const [isLoading, setIsLoading] = useState(true)

    const [pictures, setPictures] = useState(null)

    useEffect(() => {
        fetchPics()
    }, [])

    const fetchPics = async () => {
        axios.get('gallery/all')
            .then(res => {
                setPictures(res.data.pictures)
            })
            .finally(() => setIsLoading(false))
    }

    if (isLoading) return <Loader />

    return (
        <div className="gallery">
            <div className="header-page">
                <img src="/galleryBG.jpg" />
                <h1 >GALLERY</h1>
                <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Cupiditate accusantium iste reprehenderit molestias sint qui obcaecati ut?</p>
            </div>
            <div className="pics-wrapper">
                {pictures.map(pic => (
                    <div className="pic" key={pic._id}>
                        <img src={pic.img} />
                        <p>{pic.caption}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Gallery