import { Request, Response, NextFunction } from 'express'
import sanitize from 'mongo-sanitize'

import UserService from '../services/user.service'
import { IUser } from '@models/user.model'
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
            data: foundUser.hidePassword(),
            token: accessToken,
        })
    }
    // @desc Refresh
    // @route GET /auth/refresh
    // @access Public - because access token has expired
    public refresh = (req, res) => {
        const cookies = req.cookies

        if (!cookies?.jwt)
            return res.status(401).json({ message: 'Unauthorized' })

        const refreshToken = cookies.jwt

        jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET,
            async (err, decoded) => {
                if (err) return res.status(403).json({ message: 'Forbidden' })

                const foundUser = await User.findOne({
                    username: decoded.username,
                }).exec()

                if (!foundUser)
                    return res.status(401).json({ message: 'Unauthorized' })

                const accessToken = jwt.sign(
                    {
                        UserInfo: {
                            username: foundUser.username,
                            roles: foundUser.roles,
                        },
                    },
                    process.env.ACCESS_TOKEN_SECRET,
                    { expiresIn: '15m' }
                )

                res.json({ accessToken })
            }
        )
    }

    // @desc Logout
    // @route POST /auth/logout
    // @access Public - just to clear cookie if exists
    public logout = (req, res) => {
        const cookies = req.cookies
        if (!cookies?.jwt) return res.sendStatus(204) //No content
        res.clearCookie('jwt', {
            httpOnly: true,
            sameSite: 'None',
            secure: true,
        })
        res.json({ message: 'Cookie cleared' })
    }
}
