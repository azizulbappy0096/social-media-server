const mongoose = require("mongoose");

// post schema MongoDB
const PostSchema = new mongoose.Schema({
    username: String,
    body: String,
    createdAt: String,
    comments: [
        {
            username: String,
            body: String,
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