const express = require('express')
const mongoose = require('mongoose')

const connectionString = "mongodb://localhost:27017/Lagoon"

const app = express()

app.use((_, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE')
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    res.header('Access-Control-Allow-Credentials', true)
    next()
})

app.use(express.json({ limit: '50mb' }))

app.use(express.urlencoded({ limit: '50mb', extended: true }))

app.use(express.json())



mongoose.connect(connectionString)
    .then(() => {
        app.listen(8000, () => {
            console.log("Database is ready")
        })
    })
    .catch((error) => {
        console.log(error)
    })