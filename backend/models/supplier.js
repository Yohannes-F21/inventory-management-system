const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const suppliersSchema = new Schema({
  supplierID: {
    type: String,
    unique: true,
    required: true,
  },
  supplierName: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    requierd: [true, "Please add your address"],
  },
  phone: {
    type: Number,
    requierd: [true, "Please add your Phone number"],
    // validate: {
    //   validator: function (value) {
    //     // Regular expression to validate phone number format
    //     const phoneRegex = /^\d{10}$/; // Assuming 10-digit phone number format

    //     return phoneRegex.test(value);
    //   },
    //   message: "Invalid phone number format",
    // },
  },
  registerDate: {
    type: Date,
    default: Date.now,
    requierd: [true, "Please add your Phone number"],
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please Enter a Proper email",
    ],
  },
});

module.exports = mongoose.model("Suppliers", suppliersSchema);
