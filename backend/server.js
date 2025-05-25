const express = require('express')
const mongoose = require('mongoose')
const { createServer } = require('node:http')
const { Server } = require('socket.io')

require('dotenv').config()

const userRoute = require('./routes/userRoute')
const adminRoute = require('./routes/adminRoute')
const roomRoute = require('./routes/roomRoute')
const galleryRoute = require('./routes/galleryRoute')
const amenityRoute = require('./routes/amenityRoute')
const bookRoute = require('./routes/bookRoute')
const adminSettingsRoute = require('./routes/adminSettingsRoute')
const archiveRoute = require('./routes/archiveRoute')
const activityLogRoute = require('./routes/activityLogRoute')
const otpRoute = require('./routes/otpRoute')
const roomTypeRoute = require('./routes/roomTypeRoute')
const dashboardRoute = require('./routes/dashboardRoute')
const databaseRoute = require('./routes/databaseRoute')
const feedbackRoute = require('./routes/feedbackRoute')
const reportRoute = require('./routes/reportRoute')

const app = express()
const server = createServer(app)
const io = new Server(server, { cors: { origin: '*' } })

// MIDDLEWARE
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE')
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    res.header('Access-Control-Allow-Credentials', true)
    if (req.method === 'OPTIONS') {
        return res.status(200).end()
    }
    next()
})
app.use(express.json({ limit: '100gb' }))
app.use(express.urlencoded({ limit: '100gb', extended: true }))

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
app.use('/otp', otpRoute)
app.use('/room-type', roomTypeRoute)
app.use('/dashboard', dashboardRoute)
app.use('/database', databaseRoute)
app.use('/feedback', feedbackRoute)
app.use('/report', reportRoute)

// WEB SOCKET
io.on('connection', socket => {
    socket.on('new-booking', data => {
        io.emit('new-booking', data)
    })

    socket.on('cancel-booking', data => {
        io.emit('cancel-booking', data)
    })
})

// CONNECTION
mongoose.connect(process.env.DB_CONNECTIONSTING)
    .then(() => {
        server.listen(process.env.PORT, '0.0.0.0', () => {
            console.log("Database is ready")
        })
    })
    .catch((error) => {
        console.log(error)
    })