const { logEvents } = require('./logger')
import { Response, Request } from 'express'

const errorHandler = (err: any, req: Request, res: Response) => {
    logEvents(
        `${err.name}: ${err.message}\t${req.method}\t${req.url}\t${req.headers.origin}`,
        'errLog.log'
    )
    console.log(err.stack)

    const status: Number = res.statusCode ? res.statusCode : 500

    res.status(status)

    res.json({ message: err.message, isError: true })
}

module.exports = errorHandler
