const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const catagorySchema = new Schema({
  catagoryID: {
    type: String,
    unique: true,
    required: true,
  },
  catagoryName: {
    type: String,
    required: [true, "Please add the Catagory Name"],
  },
  description: {
    type: String,
    required: [true, "Please add Description"],
  },
  registerDate: {
    type: Date,
    default: Date.now,
    required: [true, "Please add Date"],
  },
});

module.exports = mongoose.model("Catagory", catagorySchema);
