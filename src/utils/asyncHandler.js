const asyncHandler = (func) => async(req,res,next)=>{
    try {
        await func(req,res,next)
    } catch (error) {
        next(error)
        console.log("async Handler ",error);
    }
}

export default asyncHandler