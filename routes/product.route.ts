import { Router } from 'express'
import { ProductController } from '../controllers/product.controller'
import { isAuthenticated, isAdmin } from '../middleware/auth'
import { upload } from '../middleware/fileUpload'

export class ProductRoutes {
    public router: Router
    public productController: ProductController = new ProductController()

    constructor() {
        this.router = Router()
        this.routes()
    }

    routes() {
        this.router.get(
            '/',
            isAuthenticated,
            this.productController.getProducts
        )
        this.router.get(
            '/:id',
            isAuthenticated,
            this.productController.getProduct
        )
        this.router.post(
            '/',
            isAuthenticated,
            isAdmin,
            upload.array('images', 10),
            this.productController.createProduct
        )
    }
}
