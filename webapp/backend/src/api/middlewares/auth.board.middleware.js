
import asyncCatch from "./error.middleware.js";

/**
 * Checks basic access authentication
 * @param {ApplicationContext} context 
 */
export default function authBoardMiddleware(context) {

    return asyncCatch(async (req, res, next) => {

        const authHeader = req.header("Authorization");

        if (!authHeader) {

            res.setHeader("WWW-Authenticate", 'Basic realm="ESP Manager", charset="UTF-8"');
            res.status(401).end();

            return;
        }

        // Parse auth header

        const credentialsEncoded = authHeader.split(" ")[1];
        const credentialsDecoded = Buffer.from(credentialsEncoded, "base64").toString("utf-8");
        const [ boardId , httpPassword ] = credentialsDecoded.split(":");

        // Verify credentials

        await context.board.getByHttpCredentials(boardId, httpPassword);

        req.boardId = boardId;

        next();
    });
}