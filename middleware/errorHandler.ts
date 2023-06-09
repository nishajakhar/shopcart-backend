import { logEvents } from '../services/logger.service'
import { Request, Response, NextFunction } from 'express'
import {
    ErrorException,
    ErrorCode,
    ErrorModel,
} from '../services/error.service'

export default function errorHandler(
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) {
    logEvents(
        `${err.name}: ${err.message}\t${req.method}\t${req.url}\t${req.headers.origin}`,
        'errLog.log'
    )

    if (err instanceof ErrorException) {
        console.log('I am ehehehe...', typeof err)
        console.log('I  errr.....', err)
        return res.status(err.status).json(err) // Known Error
    } else
        res.status(500).send({
            code: ErrorCode.UnknownError,
            status: 500,
            message: 'Something went wrong',
        } as ErrorModel) // For unhandled errors
}
