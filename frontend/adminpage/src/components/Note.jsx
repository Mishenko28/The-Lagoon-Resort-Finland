



const Note = ({ openedNote, setOpenedNote }) => {
    return (
        <div className="full-cont">
            <div className="opened-note">
                <i onClick={() => setOpenedNote("")} className="fa-solid fa-xmark" />
                <h1>Note:</h1>
                <p>{openedNote}</p>
            </div>
        </div>
    )
}

export default Note