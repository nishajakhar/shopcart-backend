import { Schema, model, Document } from 'mongoose'
import bcrypt from 'bcrypt-nodejs'
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
    hashPassword(): Promise<string>
}

const userSchema: Schema = new Schema({
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
    role: {
        type: String,
        default: 'User',
        enum: ['User', 'Admin'],
    },
    isUserVerified: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
    },
    updatedAt: {
        type: Date,
    },
})

userSchema.pre<IUser>('save', function save(next) {
    const user = this

    bcrypt.genSalt(10, (err: Error, salt: Number) => {
        if (err) return next(err)
        bcrypt.hash(
            this.password,
            salt,
            undefined,
            (err: Error, hash: string) => {
                if (err) return next(err)
                user.password = hash
                next()
            }
        )
    })
})

userSchema.methods.comparePassword = function (password: string) {
    return bcrypt.compareSync(password, this.password)
}

userSchema.methods.hidePassword = function () {
    this.toObject({ virtuals: true })
    delete this.password
    delete this.__v
    delete this._id
    return this
}

module.exports = model<IUser>('User', userSchema)
