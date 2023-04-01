import { Request, Response } from 'express'
import sanitize from 'mongo-sanitize'

import UserService from '../services/user.service'
import { logEvents } from '../services/logger.service'
import { IUser } from '@models/user.model'
import * as jwt from 'jsonwebtoken'

export class AuthController {
    // @desc Login User
    // @route POST /api/auth/login
    // @access Public
    public async login(req: Request, res: Response, next: NextFunction) {
    
            const { email, password } = req.body

            if (!email || !password)
                return res
                    .status(400)
                    .json({ message: 'All fields are required' })

            let sanitizedInput = sanitize<{
                password: string
                email: string
            }>(req.body)
            sanitizedInput.email = sanitizedInput.email.toLowerCase()

            const foundUser: IUser = await UserService.findUserByEmail(
                sanitizedInput.email
            )
            console.log("I am founduer......", foundUser, typeof foundUser)

            if (!foundUser)
                return res
                    .status(401)
                    .json({ message: 'Incorrect email or password' })

            const match: boolean = await foundUser.comparePassword(
                sanitizedInput.password
            )

            if (!match)
                return res
                    .status(401)
                    .json({ message: 'Incorrect email or password' })

            const accessToken = jwt.sign(
                {
                    UserInfo: {
                        username: foundUser.name,
                        roles: foundUser.role,
                    },
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '15m' }
            )

            const refreshToken = jwt.sign(
                { email: foundUser.email },
                process.env.REFRESH_TOKEN_SECRET,
                { expiresIn: '7d' }
            )

            // Create secure cookie with refresh token
            res.cookie('jwt', refreshToken, {
                httpOnly: true, //accessible only by web server
                secure: true, //https
                sameSite: 'None', //cross-site cookie
                maxAge: 7 * 24 * 60 * 60 * 1000, //cookie expiry: set to match rT
            })

            // Send accessToken containing username and roles
            res.json({
                message: 'User logged in successfully',
                data : foundUser.hidePassword(),
                token: accessToken,
            })

}
