import { Request, Response } from 'express'
import multer from 'multer'
import path from 'path'

const storage = multer.diskStorage({
    destination: function (req: Request, file, cb) {
        cb(null, path.join(__dirname, '../../', '/public/images/'))
    },
    filename: function (req: Request, file, cb) {
        cb(
            null,
            file.fieldname +
                '-' +
                Date.now() +
                file.originalname.match(/\..*$/)[0]
        )
    },
})

export const upload = multer({
    storage,
    limits: { fileSize: 1 * 1024 * 1024 }, // 1MB
    fileFilter: (req, file, cb) => {
        if (
            file.mimetype == 'image/png' ||
            file.mimetype == 'image/jpg' ||
            file.mimetype == 'image/jpeg'
        ) {
            cb(null, true)
        } else {
            cb(null, false)
            const err = new Error('Only .png, .jpg and .jpeg format allowed!')
            err.name = 'ExtensionError'
            return cb(err)
        }
    },
})
