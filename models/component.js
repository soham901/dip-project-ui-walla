import mongoose from "mongoose";

const componentSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    preview_link: {
        type: String,
    },
    img_link: {
        type: String,
    },
});

const Component = mongoose.model("Component", componentSchema);


export default Component;
