import Component from "../models/component.js";

async function getComponents() {
    return await Component.find({});
}

async function getComponent(id) {
    return await Component.findById(id);
}

async function createComponent(component) {
    return await Component.create(component);
}

async function deleteComponent(id) {
    return await Component.findByIdAndDelete(id);
}

async function updateLinks(id, preview_link, img_link) {
    return await Component.findByIdAndUpdate(id, { preview_link: preview_link, img_link: img_link });
}

export { getComponents, getComponent, createComponent, deleteComponent, updateLinks };
