const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const PostSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: "User" },
  dateCreated: { type: String, default: "" },
  isCompleted: { type: Boolean, default: false },
  dateCompleted: { type: String, default: "" },
});

module.exports = mongoose.model("Post", PostSchema);
