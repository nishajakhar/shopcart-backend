const allowedOrigins = JSON.parse(process.env.CORS_URLS)

const corsOptions = {
    origin: (origin: string, callback: any) => {
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    },
    credentials: true,
    optionsSuccessStatus: 200,
}
export default corsOptions
