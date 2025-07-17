
// https://thecodebarbarian.com/80-20-guide-to-express-error-handling
// https://github.com/curityio/oauth-agent-node-express/blob/master/src/middleware/exceptionMiddleware.ts

/**
 * Wraps request handler with errorMiddleware
 * @param {(req: any, res: any, next: any) => void} fn - Request handler
 * @returns {(req: any, res: any, next: any) => void} - Request handler wrapped by errorMiddleware
 */
export default function asyncCatch(fn) {

    return (req, res, next) => {

        fn(req, res, next).catch((err) => errorMiddleware(err, req, res, next));
    };
}

/**
 * Sends error response
 * @param {any} err 
 * @param {any} req 
 * @param {any} res 
 * @param {any} next 
 */
function errorMiddleware(err, req, res, next) {

    res.status(err.statusCode || 500).json({ message: err.message || "Internal server error" });
}