const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    createdAt: String
});

module.exports = mongoose.model("Users", UserSchema);