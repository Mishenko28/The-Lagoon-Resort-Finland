import { Link, useRouteError } from "react-router-dom"




const Error = () => {
    const error = useRouteError()

    return (
        <div className="error-page">
            <div className="error-cont">
                <h1><i className="fa-solid fa-triangle-exclamation" />An Error Occurred</h1>
                <h2>{error.message}</h2>
                <Link to='/'>Go Back To Homepage</Link>
            </div>

        </div>
    )
}

export default Error