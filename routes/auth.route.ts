import { Router } from 'express'
import { AuthController } from '../controllers/auth.controller'

export class AuthRoutes {
    router: Router
    public authController: AuthController = new AuthController()

    constructor() {
        this.router = Router()
        this.routes()
    }
    routes() {
        this.router.post('/login', this.authController.login)
    }
}
