import { Request, Response, NextFunction } from 'express'
import sanitize from 'mongo-sanitize'

import UserService from '../services/user.service'
import { IUser } from '../models/user.model'
import * as jwt from 'jsonwebtoken'
import { ErrorException, ErrorCode } from '../services/error.service'

export class AuthController {
    // @desc Login User
    // @route POST /api/auth/login
    // @access Public
    public async login(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const { email, password } = req.body

            if (!email || !password)
                throw new ErrorException(
                    ErrorCode.AsyncError,
                    'Required fields missing'
                )
            let sanitizedInput = sanitize<{
                password: string
                email: string
            }>(req.body)
            sanitizedInput.email = sanitizedInput.email.toLowerCase()

            const foundUser: IUser = await UserService.findUserByEmail(
                sanitizedInput.email
            )

            if (!foundUser)
                throw new ErrorException(
                    ErrorCode.Unauthenticated,
                    'Incorrect email or password'
                )
            const match: boolean = await foundUser.comparePassword(
                sanitizedInput.password
            )

            if (!match)
                throw new ErrorException(
                    ErrorCode.Unauthenticated,
                    'Incorrect email or password'
                )
            console.log('I am found user..', foundUser)
            const accessToken = jwt.sign(
                {
                    name: foundUser.name,
                    email: foundUser.email,
                    role: foundUser.role,
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '3d' }
            )

            res.json({
                message: 'User logged in successfully',
                data: foundUser.hidePassword(),
                token: accessToken,
            })
        } catch (err) {
            next(err)
        }
    }
}
