import express from "express";

const app = express();


app.get("/", (req, res) => {
    res.send("Hello World");
});


app.post("/", (req, res) => {
    console.log(req.body);
    const { name } = req.body;
    res.send("Hello " + name);
});


app.listen(3000, () => {
    console.log("Server is running");
});