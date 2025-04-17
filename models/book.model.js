import mongoose from "mongoose";

const BookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Please enter book title"],
    },
    caption: {
        type: String,
        required: [true, "Please enter book caption"],
    },
    image: {
        type: String,
        required: [true, "image required"],
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }
},{timestamps:true});

export const Book = mongoose.model("Book", BookSchema);