const mongoose = require('mongoose')
const { logEvents } = require('../middleware/logger')

const dbURI = process.env.DB_URI || ''
console.log('I am here....', dbURI)

const options = {
    useNewUrlParser: true,
    // useCreateIndex: true,
    useUnifiedTopology: true,
    // useFindAndModify: false,
    // autoIndex: true,
    // poolSize: 10,
    // bufferMaxEntries: 0,
    // autoReconnect: true,
}

// Create the database connection
mongoose
    .connect(dbURI, options)
    .then(() => {
        console.log('Mongoose connection done')
    })
    .catch(e => {
        console.log('Mongoose connection error', e)
    })

// CONNECTION EVENTS
// When successfully connected
mongoose.connection.on('connected', () => {
    console.log('Mongoose default connection open to ' + dbURI)
})

// If the connection throws an error
mongoose.connection.on('error', err => {
    console.log('Mongoose default connection error: ')
    logEvents(
        `${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`,
        'mongoErrLog.log'
    )
})

// When the connection is disconnected
mongoose.connection.on('disconnected', () => {
    console.log('Mongoose default connection disconnected')
})

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', () => {
    mongoose.connection.close(() => {
        console.log(
            'Mongoose default connection disconnected through app termination'
        )
        process.exit(0)
    })
})
