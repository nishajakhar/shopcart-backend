import { Request, Response } from 'express'
import sanitize from 'mongo-sanitize'

import UserService from '../services/user.service'
import { IUser } from '@models/user.model'
import { ErrorException, ErrorCode } from '../services/error.service'

export class UserController {
    // @desc Register User
    // @route POST /api/user/register
    // @access Public
    public async registerUser(req: Request, res: Response): Promise<void> {
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

        await UserService.createUser(sanitizedInput)
        res.status(200).send({
            message: 'User created successfully. Please verify your email.',
        })
    }
}
