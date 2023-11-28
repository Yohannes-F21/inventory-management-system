const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  orderID: {
    type: String,
    unique: true,
    required: true,
  },
  productID: {
    type: Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  supplierID: {
    type: Schema.Types.ObjectId,
    ref: "Supplier",
    required: true,
  },
  quantityOrdered: {
    type: Number,
    required: true,
  },
  unitPrice: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["canceled", "delivered", "pending"],
    default: "pending",
    required: true,
  },
  orderDate: {
    type: Date,
    default: Date.now,
    required: true,
  },
  deliveryDate: {
    type: Date,
    required: true,
  },
});

module.exports = mongoose.model("Order", orderSchema);
