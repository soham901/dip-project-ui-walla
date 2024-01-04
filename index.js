import express from "express";
import cors from "cors";
import jwt from 'jsonwebtoken';
import dotenv from "dotenv"
import bodyParser from "body-parser";

// dotenv.config({ path: '.env' });
dotenv.config({ path: './.env' });

import { connectDB } from "./db.js";

connectDB();

import { Comp } from "./models.js";

const app = express();

app.use(cors({
    origin: "*",
    credentials: true
}));


app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static("public"))
// app.use(bodyParser.text())
app.use(bodyParser.json())


app.get("/", (req, res) => {
    res.sendFile('index.html', { root: path.join(__dirname, 'public') });
});


app.post("/", (req, res) => {
    console.log(req.body);
    const { name } = req.body;
    res.json({ message: `Hello ${name}` })
});


app.post("/generateToken", (req, res) => {
    let jwtSecretKey = process.env.SECRET;
    let data = {
        time: Date(),
        userId: 12,
    }
    // expires in 5 minutes
    const token = jwt.sign(data, jwtSecretKey, { expiresIn: "5m" });
    res.json({ token: token });
});


app.get("/validateToken", (req, res) => {
    let jwtSecretKey = process.env.SECRET;
    try {
        const token = req.header("Authorization");

        const verified = jwt.verify(token, jwtSecretKey);
        if (verified) {
            return res.send("Successfully Verified");
        } else {
            return res.status(401).send(error);
        }
    } catch (error) {
        return res.status(401).send(error);
    }
});


app.get("/component", (req, res) => {
    const id = req.query?.id;
    const preview = req.query?.preview;

    if (id) {
        if (preview == "true") {
            console.log("preview");
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
        else if (preview == "false") {
            console.log("download");
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
                res.setHeader('Content-disposition', 'attachment; filename=component.html');
                res.setHeader('Content-type', 'text/html');
                res.charset = 'UTF-8';
                res.write(code);
                res.end();
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


app.post("/component", (req, res) => {
    const { html, css, js, title } = req.body;
    const category = req.body?.category || "general";

    Comp.create({ title: title, html: html, css: css, js: js, category: category }).then((data) => {
        console.log(data);
        res.json({ message: "Component Saved" })
    })
});


app.delete("/component", (req, res) => {
    const { id } = req.body;
    Comp.findByIdAndDelete(id).then((data) => {
        res.json({ message: "Component Deleted" })
    })
});


app.listen(3000, () => {
    console.log("Server is running");
});