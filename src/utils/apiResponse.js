class ApiResponse {
    constructor(
        successCode,
        data,
        message,
    ){
        this.sucess = true,
        this.successCode = successCode,
        this.data = data,
        this.message = message
    }
}

export default ApiResponse