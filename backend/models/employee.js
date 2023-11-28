const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const employeeSchema = new Schema({
  employeeID: {
    type: String,
    unique: true,
    required: true,
  },
  firstName: {
    type: String,
    ref: "Product",
    required: true,
  },
  lastName: {
    type: String,
    ref: "Supplier",
    required: true,
  },

  gender: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: [true, "Please add your email"],
    unique: true,
    trim: true,
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please Enter a Proper email",
    ],
  },
  phone: {
    type: Number,
    required: [true, "Please Enter a Phone"],
    default: "+251",
  },
  hiredDate: {
    type: Date,
    required: true,
  },
});

module.exports = mongoose.model("Employee", employeeSchema);
