export class ErrorCode {
    public static readonly Unauthenticated = 'Unauthenticated'
    public static readonly NotFound = 'NotFound'
    public static readonly MaximumAllowedGrade = 'MaximumAllowedGrade'
    public static readonly AsyncError = 'AsyncError'
    public static readonly DuplicateError = 'DuplicateError'
    public static readonly UnknownError = 'UnknownError'
}

export class ErrorModel {
    public code: string
    public status: number
    public message: string
    public metaData?: any
}

export class ErrorException extends Error {
    public status: number = null
    public metaData: any = null
    constructor(
        code: string = ErrorCode.UnknownError,
        message: string = 'Something went wrong',
        metaData: any = null
    ) {
        super(code)
        Object.setPrototypeOf(this, new.target.prototype)
        this.name = code
        this.status = 500
        this.metaData = metaData
        this.message = message
        switch (code) {
            case ErrorCode.Unauthenticated:
                this.status = 401
                break
            case ErrorCode.MaximumAllowedGrade:
                this.status = 400
                break
            case ErrorCode.AsyncError:
                this.status = 400
                break
            case ErrorCode.DuplicateError:
                this.status = 409
                break
            case ErrorCode.NotFound:
                this.status = 404
                break
            default:
                this.status = 500
                break
        }
    }
}
