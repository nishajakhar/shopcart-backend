import { Schema, model, Document } from 'mongoose'
import bcrypt from 'bcryptjs'
export interface IUser extends Document {
    name: string
    email: string
    password: string
    role: string
    isUserVerified: boolean
    createdAt: Date
    updatedAt: Date
    comparePassword(password: string): boolean
    hidePassword(): void
}

const userSchema: Schema = new Schema(
    {
        name: {
            type: String,
            required: true,
            minlength: 2,
            maxlength: 50,
        },
        email: {
            type: String,
            required: true,
            minlength: 5,
            maxlength: 255,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        roles: {
            type: String,
            default: 'User',
        },
        isUserVerified: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
)

userSchema.pre<IUser>('save', function save(next) {
    const user = this
    const saltRounds = 10
    bcrypt.hash(user.password, saltRounds, (err, hash) => {
        if (err) next(err)
        this.password = hash
        next()
    })
})

userSchema.methods.comparePassword = function (password: string) {
    return bcrypt.compareSync(password, this.password)
}

userSchema.methods.hidePassword = function () {
    let user = this.toObject({ virtuals: true })
    delete user.password
    delete user.__v
    delete user._id
    return user
}
export const User = model<IUser>('User', userSchema)

export default User
