class ApiError extends Error {
    constructor(
        statusCode,
        message = "Something wents wrong",
        error = []
        ){
            super(message)
            this.statusCode = statusCode,
            this.data = null,
            this.error = error,
            this.sucess = false
    }
}

export default ApiError