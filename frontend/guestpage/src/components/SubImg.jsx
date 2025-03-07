import { useState } from "react"




const SubImg = ({ subImgToShow, setSubImgToShow }) => {
    const subImgs = subImgToShow.images
    const [activeImg, setActiveImg] = useState(0)


    return (
        <div className="full-cont">
            <div className="sub-img">
                <div className="sub-img-header">
                    <h1>ROOM {subImgToShow.roomNo}</h1>
                    <i onClick={() => setSubImgToShow(null)} className="fa-solid fa-xmark" />
                </div>
                <img className="big" src={subImgs[activeImg]} />
                <div className="sub-navs">
                    <button onClick={() => setActiveImg(prev => Math.max(prev - 1, 0))}><i className="fa-solid fa-caret-left" /></button>
                    <div className="sub-imgs-wrapper">
                        {subImgs.map((subImg, index) => (
                            <img key={index} className={(index === activeImg ? 'active' : null) + ' small'} src={subImg} onClick={() => setActiveImg(index)} />
                        ))}
                    </div>
                    <button onClick={() => setActiveImg(prev => Math.min(prev + 1, subImgs.length - 1))}><i className="fa-solid fa-caret-right" /></button>
                </div>
            </div>
        </div >
    )
}

export default SubImg