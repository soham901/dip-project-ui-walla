import { Router } from "express";

import { getComponents, getComponent, createComponent, deleteComponent } from "../controllers/component.js";

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

router.post("/", (req, res) => {
    const { title, code } = req.body;
    res.send(createComponent({ title, code }));
    // res.send(createComponent({ title, code, description }));
});

router.delete("/:id", (req, res) => {
    res.send(deleteComponent(req.params.id));
});

export default router;
