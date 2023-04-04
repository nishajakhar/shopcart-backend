import { Document, Schema, Model, model, Error } from 'mongoose'

export interface IProduct extends Document {
    name: string
    price: number
    description: string
    category: string
    images: string[]
}

export const productSchema = new Schema(
    {
        name: String,
        price: Number,
        description: String,
        category: String,
        images: [String],
    },
    { timestamps: true }
)

export const Product: Model<IProduct> = model<IProduct>(
    'Product',
    productSchema
)
