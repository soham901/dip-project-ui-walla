import mongoose from "mongoose";

const componentSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    code: {
        type: String,
        required: true,
    },
});

const Component = mongoose.model("Component", componentSchema);


export default Component;
