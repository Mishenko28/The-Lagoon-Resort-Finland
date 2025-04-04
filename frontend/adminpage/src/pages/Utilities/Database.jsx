import axios from "axios"
import { useEffect, useState } from "react"
import useAdmin from "../../hooks/useAdmin"
import Loader2 from "../../components/Loader2"

function camelCaseToNormal(str) {
    const result = str.replace(/([A-Z])/g, ' $1').toLowerCase()

    return result.charAt(0).toUpperCase() + result.slice(1)
}


const Database = () => {
    const { dispatch } = useAdmin()
    const [isLoading, setIsLoading] = useState(true)

    const [collections, setCollections] = useState([])

    const [restoreFile, setRestoreFile] = useState(null)
    const [importFile, setImportFile] = useState(null)

    useEffect(() => {
        fetchAllCollectionNames()
    }, [])

    const handleDownload = async (data, filename) => {
        const blobStream = new Blob([JSON.stringify(data, null, 4)], { type: "application/json" })

        const url = URL.createObjectURL(blobStream)
        const a = document.createElement("a")
        a.href = url
        a.download = filename || "backup.json"
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
    }

    const convertToJson = (file) => {
        const reader = new FileReader()

        return new Promise((resolve, reject) => {
            reader.onload = (event) => {
                try {
                    const jsObject = JSON.parse(event.target.result)
                    resolve(jsObject)
                } catch (error) {
                    reject(error)
                }
            }

            reader.onerror = (error) => {
                reject(error)
            }

            reader.readAsText(file)
        })
    }

    const handleImport = async () => {
        setIsLoading(true)

        convertToJson(importFile)
            .then(collections => {
                axios.post("/database/import", { collections })
                    .then(res => {
                        dispatch({ type: 'SUCCESS', payload: true })
                    })
                    .catch(err => {
                        setImportFile(null)
                        dispatch({ type: 'FAILED', payload: err.response.data.error })
                        console.log(err)
                    })
            })
            .catch(err => {
                dispatch({ type: 'FAILED', payload: "Invalid JSON format" })
                console.log(err)
            })
            .finally(() => setIsLoading(false))
    }

    const handleRestore = async () => {
        setIsLoading(true)

        convertToJson(restoreFile)
            .then(collections => {
                axios.post("/database/restore", { collections })
                    .then(res => {
                        dispatch({ type: 'SUCCESS', payload: true })
                    })
                    .catch(err => {
                        setRestoreFile(null)
                        dispatch({ type: 'FAILED', payload: err.response.data.error })
                        console.log(err)
                    })
            })
            .catch(err => {
                dispatch({ type: 'FAILED', payload: "Invalid JSON format" })
                console.log(err)
            })
            .finally(() => setIsLoading(false))
    }

    const handleBackupOne = async (collection) => {
        setIsLoading(true)
        axios.get("/database/single", { params: { collectionName: collection } })
            .then(res => {
                handleDownload(res.data, `${collection}.json`)
            })
            .catch(err => {
                dispatch({ type: 'FAILED', payload: err.response.data.error })
                console.log(err)
            })
            .finally(() => setIsLoading(false))
    }

    const handleBackupAll = async () => {
        setIsLoading(true)
        axios.get("/database/all")
            .then(res => {
                handleDownload(res.data, "database.json")
            })
            .catch(err => {
                dispatch({ type: 'FAILED', payload: err.response.data.error })
                console.log(err)
            })
            .finally(() => setIsLoading(false))
    }

    const fetchAllCollectionNames = async () => {
        axios.get("/database/collections")
            .then(res => setCollections(res.data))
            .catch(err => {
                dispatch({ type: 'FAILED', payload: err.response.data.error })
                console.log(err)
            })
            .finally(() => setIsLoading(false))
    }

    return (
        <div className="database">
            {isLoading ?
                <Loader2 />
                :
                <>
                    <div className="header">
                        <div className="left">
                            <h1><img src="https://www.svgrepo.com/show/331488/mongodb.svg" />MONGO DB</h1>
                            <p>This system runs in MongoDB, a powerful NoSQL database designed for flexibility and scalability.</p>
                        </div>
                    </div>
                    <div className="restore-container">
                        <div className="restore">
                            <h1>Restore</h1>
                            <p>This will remove the existing collection and replace it with the new one. This action cannot be undone.</p>
                            <div className="input-cont">
                                <input type="file" accept=".json" onChange={e => setRestoreFile(e.target.files[0])} />
                                <i className="fa-solid fa-database" />
                            </div>
                            <button disabled={!restoreFile} onClick={handleRestore}>Restore</button>
                        </div>
                        <div className="restore">
                            <h1>Import</h1>
                            <p>This will add to the existing collection</p>
                            <div className="input-cont">
                                <input type="file" accept=".json" onChange={e => setImportFile(e.target.files[0])} />
                                <i className="fa-solid fa-database" />
                            </div>
                            <button disabled={!importFile} onClick={handleImport}>Import</button>
                        </div>
                    </div>
                    <div className="collection-container">
                        <div className="collection" key="all">
                            <h1>Full Database</h1>
                            <button disabled={isLoading} onClick={handleBackupAll}>Export</button>
                        </div>
                        {collections.map(collection => (
                            <div className="collection" key={collection}>
                                <h1>{camelCaseToNormal(collection)}</h1>
                                <button disabled={isLoading} onClick={() => handleBackupOne(collection)}>Export</button>
                            </div>
                        ))}
                    </div>
                </>
            }
        </div>
    )
}

export default Database