const mongoose = require('mongoose')
const { logEvents } = require('../middleware/logger')

class ConnectMongo {
    private dbURI = process.env.DB_URI || ''
    private options = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        autoReconnect: true,
    }
    constructor() {
        this.mongo()
    }
    // Create the database connection
    public connect() {
        mongoose
            .connect(this.dbURI, this.options)
            .then(() => {
                console.log('Mongoose connection done')
            })
            .catch((e: Error) => {
                console.log('Mongoose connection error', e)
            })
    }

    private mongo() {
        // CONNECTION EVENTS
        // When successfully connected
        mongoose.connection.on('connected', () => {
            console.log('Mongo Connection Established')
        })

        // If the connection throws an error
        mongoose.connection.on('error', (err: Error) => {
            console.log('Mongo Connection ERROR: ' + err)
            logEvents(
                `${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`,
                'mongoErrLog.log'
            )
        })

        // When the connection is disconnected
        mongoose.connection.on('disconnected', () => {
            console.log('Mongoose Connection Disconnected')
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
    }
}
const connectMongo = new ConnectMongo()
export default connectMongo
