// const notFound = (req:Request, res:Response, next:NextFunction) => {
//     const error = new Error(`Not Found - ${req.originalUrl}`)
//     res.status(404)
//     next(error)
//   }
const errorHandler = (err, req, res, next) => {
    // Log the error (can also log to an external service)
    // console.log("Middleware Error Handling");
    // console.error(err.message)
    // Set the status code based on the error or default to 500
    const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
    const errMsg = err.message || "Internal Server Error";
    res.status(statusCode).json({
        status: statusCode,
        error: errMsg,
        stack: process.env.NODE_ENV === "development" ? err.stack : {},
    });
};
export { errorHandler };
// notFound,
