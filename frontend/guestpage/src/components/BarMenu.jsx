// From Uiverse.io by vk - uiux

const BarMenu = ({ barRef, showDropdown, setShowDropdown }) => {
    return (
        <div ref={barRef} id="menuToggle">
            <input checked={showDropdown} onChange={(e) => setShowDropdown(e.target.checked)} id="checkbox" type="checkbox" />
            <label className="toggle" htmlFor="checkbox">
                <div className="bar bar--top"></div>
                <div className="bar bar--middle"></div>
                <div className="bar bar--bottom"></div>
            </label>
        </div>
    )
}

export default BarMenu