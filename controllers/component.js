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

export { getComponents, getComponent, createComponent, deleteComponent };
