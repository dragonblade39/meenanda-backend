const mongoose = require("mongoose");

const Schema = new mongoose.Schema(
  {
    name: { type: String },
    email: { type: String },
    subject: { type: String },
    message: { type: String },
  },
  {
    collection: "data",
  }
);

module.exports = mongoose.model("data", Schema);
