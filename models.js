import mongoose from "mongoose";


export const Comp = mongoose.model("Comp", mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    html: {
        type: String,
        required: true,
    },
    css: {
        type: String,
    },
    js: {
        type: String,
    },
    category: {
        type: String,
        required: true
    },
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
}));




export const User = mongoose.model("User", mongoose.Schema({
    name: String,
    email: String,
    password: String,
    isAdmin: Boolean,
}));


// User.create({
//     name: "Admin",
//     email: "admin@gmail.com",
//     password: "admin",
//     isAdmin: true,
// }).then((data) => {
//     console.log(data);
// })