import { Request, Response, NextFunction } from 'express'
import sanitize from 'mongo-sanitize'
import * as jwt from 'jsonwebtoken'
import UserService from '../services/user.service'
import { IUser } from '@models/user.model'
import { ErrorException, ErrorCode } from '../services/error.service'

export class UserController {
    // @desc Register User
    // @route POST /api/user/register
    // @access Public
    public async registerUser(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            // Check all fields
            if (!req.body.email || !req.body.password || !req.body.name)
                throw new ErrorException(
                    ErrorCode.AsyncError,
                    'Required fields missing'
                )

            let sanitizedInput = sanitize<{
                name: string
                password: string
                email: string
            }>(req.body)
            sanitizedInput.email = sanitizedInput.email.toLowerCase()

            // Check for duplicate user
            const userFound: IUser = await UserService.findUserByEmail(
                sanitizedInput.email
            )
            if (userFound)
                throw new ErrorException(
                    ErrorCode.DuplicateError,
                    'User already exists'
                )

            const newUser = await UserService.createUser(sanitizedInput)
            const accessToken = jwt.sign(
                {
                    name: newUser.name,
                    email: newUser.email,
                    role: newUser.role,
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '3d' }
            )
            res.status(200).send({
                message: 'User created successfully',
                data: {
                    _id: newUser._id,
                    name: newUser.name,
                    email: newUser.email,
                },
                token: accessToken,
            })
        } catch (err) {
            next(err)
        }
    }
}
