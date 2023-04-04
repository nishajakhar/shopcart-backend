require('dotenv').config()
import cors from 'cors'
import express, { Request, Response, Express } from 'express'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'

import connectMongo from './config/dbConn'
import { logger } from './middleware/logger'
import errorHandler from './middleware/errorHandler'
import corsOptions from './config/corsConfig'

import { ProductRoutes } from './routes/product.route'
import { UserRoutes } from './routes/user.route'
import { AuthRoutes } from './routes/auth.route'
import path = require('path')

class Server {
    constructor() {
        this.app = express()
        this.config()
        this.routes()
        this.mongoDB()
    }
    public app: Express

    public routes(): void {
        this.app.use('/api/user', new UserRoutes().router)
        this.app.use('/api/auth', new AuthRoutes().router)
        this.app.use('/api/product', new ProductRoutes().router)
        this.app.all('*', (req: Request, res: Response) => {
            res.status(404).send({
                code: 'NotFound',
                status: 404,
                message: 'Error Code : 404 Not Found',
            })
        })
        this.app.use(errorHandler)
    }

    public config(): void {
        this.app.set('port', process.env.PORT || 3500)
        this.app.use(express.static('public'))
        this.app.use(bodyParser.json())
        this.app.use(bodyParser.urlencoded({ extended: false }))
        this.app.use(cookieParser())
        this.app.use(logger)
        this.app.use(cors(corsOptions))
    }

    private mongoDB(): void {
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
