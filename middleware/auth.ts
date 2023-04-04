import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import UserService from '../services/user.service'
import { IUser } from '../models/user.model'
import { ErrorException, ErrorCode } from '../services/error.service'

export const isAuthenticated = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const authHeader =
            req.headers.authorization || req.headers.Authorization

        if (!authHeader?.startsWith('Bearer '))
            throw new ErrorException(
                ErrorCode.Unauthorized,
                'Missing Access Token'
            )

        const token = authHeader.split(' ')[1]

        const data = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

        if (!data)
            return res
                .status(401)
                .json({ message: 'Token expired. Please login again' })

        req.user = data.email
        req.role = data.role
        next()
    } catch (err) {
        console.log('I am ere.e..e.e.ee', err)
        return res.status(500).json({ message: 'Something went wrong' })
    }
}

export const isAdmin = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const userFound: IUser = await UserService.findUserByEmail(req.user)
    console.log('I am user,,,,', req.user, req.role, userFound)
    if (!userFound)
        throw new ErrorException(
            ErrorCode.ForbiddenError,
            'Access to the resource is only allowed to authorized users'
        )
    else next()
}
