import { logEvents } from '../services/logger.service'
import { Request, Response } from 'express'

const errorHandler = (err: any, req: Request, res: Response) => {
    console.log('I am heere errrr..', err)
    logEvents(
        `${err.name}: ${err.message}\t${req.method}\t${req.url}\t${req.headers.origin}`,
        'errLog.log'
    )
    console.log(err.stack)

    const status: number = res.statusCode ? res.statusCode : 500

    res.status(status).send({ message: err.message, isError: true })
}

export default errorHandler
