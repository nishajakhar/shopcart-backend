import { Request, Response } from 'express'
import sanitize from 'mongo-sanitize'

import UserService from '../services/user.service'
import { logEvents } from '../services/logger.service'
import { IUser } from '@models/user.model'

export class UserController {
    // @desc Register User
    // @route POST /api/user/register
    // @access Public
    public async registerUser(req: Request, res: Response): Promise<Response> {
        try {
            console.log('I am here...', req.body)
            // Check all fields
            if (!req.body.email || !req.body.password || !req.body.name)
                return res
                    .status(400)
                    .json({ message: 'All fields are required' })

            let sanitizedInput = sanitize<{
                name: string
                password: string
                email: string
            }>(req.body)
            sanitizedInput.email = sanitizedInput.email.toLowerCase()

            // Check for duplicate user
            const userFound = await UserService.findUserByEmail(
                sanitizedInput.email
            )
            if (userFound)
                return res.status(409).json({ message: 'User already exists' })

            await UserService.createUser(sanitizedInput)
            res.status(200).send({
                message: 'User created successfully. Please verify your email.',
            })
        } catch (err) {
            logEvents(
                `${err.name}: ${err.message}\t${req.method}\t${req.url}\t${req.headers.origin}`,
                'errLog.log'
            )
            return res
                .status(500)
                .json({ message: 'Error occurred while creating User' })
        }
    }
}
