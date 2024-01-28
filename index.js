import express from "express";
import cors from "cors";
import jwt from 'jsonwebtoken';
import dotenv from "dotenv"
import bodyParser from "body-parser";

// dotenv.config({ path: '.env' });
dotenv.config({ path: './.env' });

import { connectDB } from "./db.js";

connectDB();

import { Comp, User } from "./models.js";

const app = express();

app.use(cors({
    origin: "*",
    credentials: true,
    methods: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH', 'OPTIONS'],
}));


app.use(express.json())
app.use(express.urlencoded({ extended: true }))
//app.use(express.static("public"))
// app.use(bodyParser.text())
app.use(bodyParser.json())



const userAuth = (req, res, next) => {

    console.log("userAuth");

    const token = req.headers?.authorization?.split(" ")[1];
    if (token) {
        try {
            const verified = jwt.verify(token, "SECRET")
            if (verified) {
                next();
            } else {
                return res.status(401).send("Invalid Token");
            }
        } catch (error) {
            return res.status(401).send("Invalid Token");
        }
    }
    else {
        return res.status(401).send("Invalid Token");
    }
}


const adminAuth = (req, res, next) => {

    console.log("adminAuth");

    const token = req.headers?.authorization?.split(" ")[1];
    if (token) {
        try {
            const verified = jwt.verify(token, "SECRET")
            if (verified) {
                User.findOne({ email: verified }).then((data) => {
                    if (data.isAdmin) {
                        next();
                    }
                    else {
                        return res.status(401).send("Invalid Token");
                    }
                })
            } else {
                return res.status(401).send("Invalid Token");
            }
        } catch (error) {
            return res.status(401).send("Invalid Token");
        }
    }
    else {
        return res.status(401).send("Invalid Token");
    }
}


app.get("/", (req, res) => {
    res.json({ message: "Hello from server" })
    //res.sendFile('index.html', { root: path.join(__dirname, 'public') });
});


app.get("/users", userAuth, async (req, res) => {
    let email = req.query?.email;

    const token = req.headers?.authorization?.split(" ")[1];

    if (!token || !email) {
        return res.status(401).send("Invalid Token");
    }

    if (!email) {
        email = jwt.verify(token, "SECRET");
    }

    if (email) {
        const user = await User.findOne({ email: email });

        console.log(user);

        const likedComponents = await Comp.find({
            likes: {
                $in: [user._id]
            }
        });

        console.log(likedComponents);

        res.send(likedComponents);
    }
    else {
        const data = await User.find();
        return res.json(data);
    }
});


app.post("/signup", (req, res) => {
    const { name, email, password } = req.body;

    if (User.findOne({ email: email.toString().toLowerCase() }).then((data) => {
        if (data) {
            return res.status(401).json({ message: "User Already Exists" });
        }

        User.create({ name: name, email: email.toString().toLowerCase(), password: password }).then((data) => {
            return res.json({ message: "User Created" });
        })
    }));
});


app.post("/login", (req, res) => {
    const { email, password } = req.body;

    User.findOne({ email: email }).then((data) => {
        if (!data) {
            return res.status(401).json({ message: "Invalid Credentials" });
        }
        if (data.password != password) {
            return res.status(401).json({ message: "Invalid Credentials" });
        }

        const token = jwt.sign(data.email, "SECRET");
        res.json({ token: token });
    })
});


app.get("/validate", (req, res) => {
    const token = req.query.token;

    if (token) {
        try {
            const verified = jwt.verify(token, "SECRET")
            if (verified) {
                return res.send("Successfully Verified");
            } else {
                return res.status(401).send("Invalid Token");
            }
        } catch (error) {
            return res.status(401).send("Invalid Token");
        }
    }
    else {
        return res.status(401).send("Invalid Token");
    }
});


app.get("/component", userAuth, (req, res) => {
    const id = req.query?.id;
    const preview = req.query?.preview;
    cons

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


app.post("/component", adminAuth, (req, res) => {
    const { html, css, js, title } = req.body;
    const category = req.body?.category || "general";

    Comp.create({ title: title, html: html, css: css, js: js, category: category }).then((data) => {
        console.log(data);
        res.json({ message: "Component Saved" })
    })
});


app.delete("/component", adminAuth, (req, res) => {
    const { id } = req.body;
    Comp.findByIdAndDelete(id).then((data) => {
        if (!data) {
            return res.status(401).json({ message: "Component Not Found" });
        }
        return res.json({ message: "Component Deleted" })
    })
});


app.get("/like", userAuth, async (req, res) => {
    const { id } = req.query;
    const token = req.headers?.authorization?.split(" ")[1];
    const email = jwt.verify(token, "SECRET");

    const user = await User.findOne({ email: email });

    console.log(user);

    const component = await Comp.findById(id);

    console.log(component);

    component.likes.push(user._id);

    await component.save()

    res.send("ok");
});


app.listen(3000, () => {
    console.log("Server is running");
});
