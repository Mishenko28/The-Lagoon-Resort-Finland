import { useState } from "react"
import { firstNames, lastNames } from "../data"
import axios from "axios"

const User = () => {
    const [numberOfUsers, setNumberOfUsers] = useState(0)
    const [personalDataChance, setPersonalDataChance] = useState(75)

    let populatedNames = []

    const [loadingPercentage, setLoadingPercentage] = useState(0)

    const [totalUsers, setTotalUsers] = useState(0)

    const [isDone, setisDone] = useState(false)

    const handlePopulate = async (e) => {
        e.preventDefault()

        setisDone(false)

        await Promise.all(
            Array.from({ length: numberOfUsers }).map(async (_, i) => {
                const password = "thomas1228"
                let email
                let userPersonalData = {}

                if (Math.random() < personalDataChance / 100) {
                    userPersonalData.age = Math.floor(Math.random() * (60 - 20 + 1)) + 20
                    userPersonalData.sex = Math.random() > 0.5 ? "Male" : "Female"
                    userPersonalData.contact = `09${Math.floor(Math.random() * 1000000000)}`
                    userPersonalData.img = '/profile.webp'

                    do {
                        userPersonalData.name = `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`
                        email = `${userPersonalData.name.replace(/\s+/g, '').toLowerCase()}@gmail.com`
                    } while (populatedNames.includes(email))
                }

                if (!email) {
                    do {
                        email = `${firstNames[Math.floor(Math.random() * firstNames.length)].toLowerCase()}${lastNames[Math.floor(Math.random() * lastNames.length)].toLowerCase()}@gmail.com`
                    } while (populatedNames.includes(email))
                }

                populatedNames.push(email)

                const year = Math.random() > 0.3 ? 2024 : 2025
                const month = year === 2025 ? Math.floor(Math.random() * 3) + 1 : Math.floor(Math.random() * 12) + 1
                const day = month === 3 ? Math.floor(Math.random() * 11) + 1 : Math.floor(Math.random() * (31 - 1 + 1)) + 1
                const hour = Math.floor(Math.random() * (23 - 0 + 1)) + 0
                const minute = Math.floor(Math.random() * (59 - 0 + 1)) + 0
                const createdAt = new Date(year, month, day, hour, minute)

                try {
                    await axios.post("user/populate", {
                        email,
                        password,
                        userPersonalData,
                        createdAt
                    })
                        .then(() => {
                            setTotalUsers(prev => prev + 1)
                        })
                        .finally(() => {
                            setLoadingPercentage(prev => i == numberOfUsers - 1 ? 0 : prev + (100 / numberOfUsers))
                        })
                } catch (error) {
                    console.log(error.response)
                }
            })
        )

        setisDone(true)
        setNumberOfUsers(0)
    }


    return (
        <div className="user">
            <h1>POPULATE USER</h1>
            <form onSubmit={handlePopulate}>
                <div className="form-group">
                    <label htmlFor="num-user">Number of User/s:</label>
                    <input
                        id="num-user"
                        type="number"
                        value={numberOfUsers}
                        onChange={(e) => setNumberOfUsers(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="num-user">Chance to have Personal Data ({personalDataChance}) :</label>
                    <input
                        id="num-user"
                        type="range"
                        value={personalDataChance}
                        onChange={(e) => setPersonalDataChance(e.target.value)}
                    />
                </div>
                <button type="submit">Populate</button>
            </form>
            {loadingPercentage > 0 &&
                <div className="loading">
                    <div className="loading-bar" style={{ width: `${loadingPercentage}%` }}></div>
                    <p>{Math.floor(loadingPercentage)}%</p>
                </div>
            }
            {totalUsers > 0 &&
                <>
                    <h2>Successfully Populated Users: <b>{totalUsers}</b></h2>
                    {isDone &&
                        <h2>Populating Done</h2>
                    }
                </>
            }
        </div >
    )
}

export default User