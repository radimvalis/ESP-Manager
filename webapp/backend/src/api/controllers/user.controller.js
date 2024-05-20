
export default function UserController(context) {

    async function create(req, res, next) {

        await context.services.user.create();

        res.json({message: "User created"});
    }

    async function logIn(req, res, next) {

        console.log(req.body);

        await context.services.user.logIn();

        res.json({message: "User logged in"});
    }

    this.create = create;
    this.logIn = logIn;

    Object.freeze(this);
}