const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
    username: String,
    body: String,
    createdAt: String,
    comments: [
        {
            username: String,
            createdAt: String
        }
    ],
    likes: [
        {
            username: String,
            createdAt: String
        }
    ],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users"
    }
});

module.exports = mongoose.model("Post", PostSchema);