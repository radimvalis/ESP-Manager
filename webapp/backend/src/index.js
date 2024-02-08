
import express from "express";

const app = express();

app.get("/", (req, res) => {

    res.send("Hello World!");
});

const PORT = process.env.BACKEND_PORT;

app.listen(PORT, () => {

    console.log(`Example app listening on port ${PORT}`);
});