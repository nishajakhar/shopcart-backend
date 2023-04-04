import { Schema } from 'mongoose'
import { User, IUser } from '../models/user.model'

export const getUser = (user: IUser) => user.hidePassword()

export const createUser = async ({
    email,
    password,
    name,
}: {
    email: string
    password: string
    name: string
}) => {
    const user = new User({ name, email, password })
    return await user.save()
}

export const findUserById = async (id: typeof Schema.Types.ObjectId) =>
    await User.findById(id)

export const findUserByEmail = async (email: string) =>
    await User.findOne({ email })

// export const setUserVerified = async (user: IUser) => {
//     user.isVerified = true
//     user.expires = undefined
// }

export default {
    getUser,
    createUser,
    findUserById,
    findUserByEmail,
    // setUserVerified,
}
