require('dotenv').config()
import cors from 'cors'
import express from 'express'
import cookieParser from 'cookie-parser'

import connectMongo from './config/dbConn'
import { logger } from './middleware/logger'
import errorHandler from './middleware/errorHandler'
import corsOptions from './config/corsConfig'

class Server {
    public app: express.Application

    constructor() {
        this.app = express()
        this.config()
        this.routes()
        this.mongoDB()
    }

    public routes(): void {
        this.app.use('/', (req: Request, res: Response) => {
            res.status(200).send({ message: 'Data Fetched Successfully' })
        })

        this.app.all('*', (req: Request, res: Response) => {
            res.status(404).send('Error Code : 404 Not Found')
        })

        this.app.use(errorHandler)
    }

    public config(): void {
        this.app.set('port', process.env.PORT || 3500)
        this.app.use(logger)
        this.app.use(cors(corsOptions))
        this.app.use(express.json())
        this.app.use(express.urlencoded({ extended: false }))
        this.app.use(cookieParser())
    }

    private mongoDB() {
        connectMongo.connect()
    }

    public start(): void {
        this.app.listen(this.app.get('port'), () => {
            console.log(`Server running on port ${this.app.get('port')}`)
        })
    }
}

const server = new Server()

server.start()
