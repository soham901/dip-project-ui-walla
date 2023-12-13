import express from "express";

import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv"
import mongoose from "mongoose";

dotenv.config({ path: '.env' });

const app = express();

app.use(cors({
    origin: "*",
    credentials: true
}));

// app.use(express.json({ limit: "16kb" }))
// app.use(express.urlencoded({ limit: "16kb" }))
// app.use(express.static("public"))
app.use(cookieParser())


import { connectDB } from "./db/index.js";

connectDB();

const Comp = mongoose.model("Comp", mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    code: {
        type: String,
    },
}));

// import componentRouter from "./routes/component.js";

// app.use("/component", componentRouter);

app.use(express.static("public"));

app.post("/component", (req, res) => {
    const { html, css, js, title } = req.body;
    const code = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
        <style>${css}</style>
    </head>
    <body>
        ${html}

        <script>
            ${js}
        </script>
    </body>
    </html>
    `;

    Comp.create({ title: title, code: code }).then((data) => {
        console.log(data);
        res.send(data);
    })
        .catch((err) => {
            console.log(err);
            res.send(err);
        })

    res.send(null);
});

app.get("/component", (req, res) => {

    const id = req.query.id;
    const preview = req.query.preview;

    if (id) {
        if (preview) {
            Comp.findById(id).then((data) => {
                res.send(data.code);
            })
        }
        else {
            Comp.findById(id).then((data) => {
                res.send(data);
            })
        }
    }

    else {
        Comp.find().then((data) => {
            res.send(data);
        })
    }
});

app.listen(3000, () => {
    console.log("Listening on port 3000");
});
