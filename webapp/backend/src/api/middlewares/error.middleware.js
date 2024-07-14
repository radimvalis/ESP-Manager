
// https://thecodebarbarian.com/80-20-guide-to-express-error-handling
// https://github.com/curityio/oauth-agent-node-express/blob/master/src/middleware/exceptionMiddleware.ts

export default function asyncCatch(fn) {

    return (req, res, next) => {

        fn(req, res, next).catch((err) => errorMiddleware(err, req, res, next));
    };
}

function errorMiddleware(err, req, res, next) {

    res.status(err.statusCode || 500).send(err);
}