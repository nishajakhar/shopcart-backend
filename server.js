require('dotenv').config()
require('./config/dbConn')

const cors = require('cors')
const express = require('express')
const cookieParser = require('cookie-parser')

const { logger } = require('./middleware/logger')
const errorHandler = require('./middleware/errorHandler')
const corsOptions = require('./config/corsConfig')

const PORT = process.env.PORT || 3500

const app = express()

app.use(logger)

app.use(cors(corsOptions))

app.use(express.json())

app.use(cookieParser())

app.use('/', (req, res) => {
    res.status(200).send({ message: 'Data Fetched Successfully' })
})

app.all('*', (req, res) => {
    res.status(404).send('Error Code : 404 Not Found')
})

app.use(errorHandler)

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
