import { Router } from "express";

import multer from "multer";
import fs from "fs";

const upload = multer({ dest: "public/" }).fields([
    { name: "html", maxCount: 1 },
    { name: "css", maxCount: 1 },
    { name: "js", maxCount: 1 },
    { name: "img", maxCount: 1 },
]);

import { getComponents, getComponent, createComponent, deleteComponent, updateLinks } from "../controllers/component.js";

const router = Router();

router.get("/", (req, res) => {
    try {
        getComponents().then((components) => {
            res.send(components);
        });
    }
    catch (e) {
        console.log(e);
        res.status(500).send("Internal Server Error");
    }
});

router.get("/:id", (req, res) => {
    res.send(getComponent(req.params.id));
});

router.post("/", upload, (req, res) => {
    try {
        const html = req.files?.html && req.files?.html[0]
        const css = req.files?.css && req.files?.css[0]
        const js = req.files?.js && req.files?.js[0]
        const img = req.files?.img && req.files?.img[0]
        const { title } = req.body;

        createComponent({
            "title": title,
        }).then((component) => {
            const id = String(component._id);
            fs.mkdirSync("public/" + id);
            if (html) fs.renameSync(html.path, "public/" + id + "/" + html.originalname);
            if (css) fs.renameSync(css.path, "public/" + id + "/" + css.originalname);
            if (js) fs.renameSync(js.path, "public/" + id + "/" + js.originalname);
            if (img) fs.renameSync(img.path, "public/" + id + "/thumbnail");

            const img_link = img ? "/" + id + "/thumbnail" : null;
            const preview_link = "/" + id + "/" + html.originalname;

            res.send({
                "img_link": img_link,
                "preview_link": preview_link,
            })

            updateLinks(id, preview_link, img_link).then((component) => {
                res.send(component);
            });
        });

        // create a directory for the component
        // fs.mkdirSync("public/" + );
        // createComponent({
        //     "title": title,
        //     "preview_link": "/" + html.filename + ".html",
        // }).then((component) => {
        //     res.send(component);
        // });
    }
    catch (e) {
        console.log(e);
        res.status(500).send("Internal Server Error");
    }
});

router.delete("/:id", (req, res) => {
    res.send(deleteComponent(req.params.id));
});


export default router;
