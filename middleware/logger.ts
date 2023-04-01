import { logEvents } from '../services/logger.service'
import { Response, Request, NextFunction } from 'express'

export const logger = (req: Request, res: Response, next: NextFunction) => {
    console.log('I am request....', req.body)
    logEvents(`${req.method}\t${req.url}\t${req.headers.origin}`, 'reqLog.log')
    console.log(`${req.method} ${req.path}`)
    next()
}
