import { Router } from "express";

import { getComponents, getComponent, createComponent } from "../controllers/component.js";

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
    const { title, code, description } = req.body;
    res.send(createComponent({ title, code, description }));
    // res.send(createComponent({ title, code, description }));
});

export default router;
