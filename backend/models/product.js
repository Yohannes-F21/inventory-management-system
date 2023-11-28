const { string } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema({
  itemID: {
    type: String,
    unique: true,
    required: true,
  },
  supplierID: {
    type: Schema.Types.ObjectId,
    ref: "supplier",
    required: true,
  },
  catagoryID: {
    type: Schema.Types.ObjectId,
    ref: "catagory",
    required: true,
  },
  productName: {
    type: String,
    required: [true, "Please add your Name"],
  },
  price: {
    type: String,
    required: [true, "Please add a price"],
  },
  image: {
    type: String,
    required: [false, "Please add a description"],
  },
  description: {
    type: String,
    required: [true, "Please add a description"],
  },
  quantityOnHand: {
    type: Number,
    required: true,
  },
  reorderLevel: {
    type: Number,
    required: false,
  },
  registerDate: {
    type: Date,
    default: Date.now,
    required: true,
  },
});

module.exports = mongoose.model("Products", productSchema);
