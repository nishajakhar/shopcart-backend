import { Schema } from 'mongoose'
import { Product, IProduct } from '../models/product.model'

export const getProducts = async (page: number = 1, count: number = 10) =>
    await Product.find()
        .sort({ updatedAt: -1 })
        .skip((page - 1) * count)
        .limit(count)

export const createProduct = async ({
    name,
    price,
    description,
    category,
    images,
}: {
    name: string
    price: number
    description: string
    category: string
    images: string[]
}) => {
    const product = new Product({ name, price, description, category, images })
    return await product.save()
}

export const findProductById = async (id: typeof Schema.Types.ObjectId) =>
    await Product.findById(id)

export default {
    getProducts,
    createProduct,
    findProductById,
}
