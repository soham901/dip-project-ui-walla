import express from "express";

import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv"

dotenv.config({ path: '.env' });

const app = express();

app.use(cors({
    origin: "*",
    credentials: true
}));

app.use(express.json())
app.use(express.urlencoded())
app.use(express.static("public"))
app.use(cookieParser())


import { connectDB } from "./db.js";

connectDB();

import { Comp } from "./models.js";

app.post("/component", (req, res) => {
    console.log(req.body);
    const { html, css, js, title } = req.body;
    const category = req?.body?.category || "general";

    Comp.create({ title: title, html: html, css: css, js: js, category: category }).then((data) => {
        console.log(data);
        res.send("DONE");
    })
});

app.get("/component", (req, res) => {

    const id = req.query.id;
    const preview = req.query.preview;

    if (id) {
        if (preview) {
            Comp.findById(id).then((data) => {
                const code = `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>${data.title}</title>
                    <style>${data.css}</style>
                </head>
                <body>
                    ${data.html}

                    <script>
                        ${data.js}
                    </script>
                </body>
                </html>
                `;
                res.send(code)
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
    console.log("BACKEND IS RUNNING");
});
