const express = require('express')
const mongoose = require('mongoose')

const userRoute = require('./routes/userRoute')
const adminRoute = require('./routes/adminRoute')
const roomRoute = require('./routes/roomRoute')
const galleryRoute = require('./routes/galleryRoute')
const amenityRoute = require('./routes/amenityRoute')
const bookRoute = require('./routes/bookRoute')
const adminSettingsRoute = require('./routes/adminSettingsRoute')
const archiveRoute = require('./routes/archiveRoute')
const activityLogRoute = require('./routes/activityLogRoute')

const connectionString = "mongodb://localhost:27017/Lagoon"

const app = express()

// MIDDLEWARE
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


// ROUTES
app.use('/user', userRoute)
app.use('/admin', adminRoute)
app.use('/room', roomRoute)
app.use('/gallery', galleryRoute)
app.use('/amenity', amenityRoute)
app.use('/book', bookRoute)
app.use('/admin-settings', adminSettingsRoute)
app.use('/archive', archiveRoute)
app.use('/log', activityLogRoute)


// CONNECTION
mongoose.connect(connectionString)
    .then(() => {
        app.listen(8000, () => {
            console.log("Database is ready")
        })
    })
    .catch((error) => {
        console.log(error)
    })