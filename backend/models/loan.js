const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const loanSchema = new Schema({
  loanID: {
    type: String,
    unique: true,
    required: true,
  },
  employeeID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
    required: true,
  },
  productID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  status: {
    type: String,
    enum: ["Borrowed", "Returned", "Overdue"],
    default: "Borrowed",
    required: true,
  },

  loanDate: {
    type: Date,
    default: Date.now,
    required: true,
  },
  returnDate: {
    type: Date,
    required: true,
  },
});

module.exports = mongoose.model("Loan", loanSchema);
