import mongoose, { Error } from 'mongoose'
import { logEvents } from '../services/logger.service'

interface IError extends Error {
    no: string
    code: string
    syscall: string
    hostname: string
}
class ConnectMongo {
    private dbURI = process.env.DB_URI || ''
    constructor() {
        this.mongo()
    }
    // Create the database connection
    public connect() {
        mongoose
            .connect(this.dbURI)
            .then(() => {
                console.log('Mongoose connection done')
                return true
            })
            .catch((e: Error) => {
                console.log('Mongoose connection error', e)
                return e
            })
    }

    private mongo() {
        // CONNECTION EVENTS
        // When successfully connected
        mongoose.connection.on('connected', () => {
            console.log('Mongo Connection Established')
        })

        // If the connection throws an error
        mongoose.connection.on('error', (err: IError) => {
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
    }
}
const connectMongo = new ConnectMongo()
export default connectMongo
