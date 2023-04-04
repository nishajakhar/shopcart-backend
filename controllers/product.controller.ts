import { Request, Response, NextFunction } from 'express'
import { IProduct, Product } from '../models/product.model'
import ProductService from '../services/product.service'
import { ErrorException, ErrorCode } from '../services/error.service'

export class ProductController {
    public async getProducts(req: Request, res: Response): Promise<void> {
        try {
            const { page, count } = req.query
            const products = await ProductService.getProducts(page, count)
            res.json({
                message: 'Products fetched successfully',
                data: products,
            })
        } catch (err) {
            next(err)
        }
    }

    public async getProduct(req: Request, res: Response): Promise<void> {
        try {
            const product = await ProductService.findProductById(req.params.id)
            if (!product)
                throw new ErrorException(
                    ErrorCode.NotFound,
                    'Product not found'
                )
            res.status(200).json({
                message: 'Product fetched successfully',
                data: product,
            })
        } catch (err) {
            next(err)
        }
    }

    public async createProduct(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            console.log('I am here...', req.files, req.body)
            const { name, description, category, price } = req.body
            const images: string[] = []
            await Promise.all(
                req.files.map((image) => {
                    images.push('/images/' + image.filename)
                })
            )
            const newProduct: IProduct = await ProductService.createProduct({
                name,
                description,
                category,
                price,
                images,
            })
            console.log('I am new product...', newProduct)
            if (!newProduct) throw new ErrorException(ErrorCode.UnknownError)
            res.status(200).json({
                message: 'Product created successfully',
                data: newProduct,
            })
        } catch (err) {
            next(err)
        }
    }
}
