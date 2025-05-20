
import asyncCatch from "../middlewares/error.middleware.js";

export default function UserController(context) {

    this.get = asyncCatch(async (req, res) => {

        const user = await context.user.getById(req.userId);

        res.json(user);
    });
}