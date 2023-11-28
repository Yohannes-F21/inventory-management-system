const Joi = require("joi");
const Loan = require("../models/loan");
const Product = require("../models/product");
const Employee = require("../models/employee");
const mongoose = require("mongoose");

async function generateLoanID() {
  try {
    const lastLoan = await Loan.findOne({}, "loanID loanDate")
      .sort({ loanID: -1, loanDate: -1 })
      .exec();

    let nextLoanID;

    if (lastLoan && lastLoan.loanID) {
      // Extract the numeric portion of the employeeID
      const lastLoanID = lastLoan.loanID;
      const numericPart = lastLoanID.slice(5); // Remove "EMP" prefix
      const lastNumericID = parseInt(numericPart, 10);

      // Increment the numeric part by one
      const nextNumericID = lastNumericID + 1;

      // Pad the numeric part with leading zeros
      const paddedNumericID = nextNumericID.toString().padStart(3, "0");

      // Construct the new employeeID with the prefix and padded numeric part
      nextLoanID = `LOAN-${paddedNumericID}`;
    } else {
      // If no employee found, start with EMP001
      nextLoanID = "LOAN-001";
    }

    // Use the nextEmployeeID as needed
    return nextLoanID;
  } catch (error) {
    // Handle the error
    console.error(error);
    throw error;
  }
}

const createLoan = async (req, res) => {
  const loanID = await generateLoanID();
  try {
    const { productID, employeeID, loanDate, price, returnDate, status } =
      req.body;
    console.log(returnDate);
    // Define a Joi schema for validation
    const schema = Joi.object({
      productID: Joi.string().required(),
      employeeID: Joi.string().required(),
      returnDate: Joi.date().required(),
      status: Joi.string().valid("Borrowed", "Returned", "Overdue"),
    });

    // Validate the request body against the schema
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      allowUnknown: true,
    });

    if (error) {
      const errorMessage = error.details
        .map((detail) => detail.message)
        .join("; ");
      return res.status(400).json({ message: errorMessage });
    }
    //  ;
    const { productID: validatedProductID, employeeID: validatedEmployeeID } =
      value;

    if (!mongoose.Types.ObjectId.isValid(validatedProductID)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    if (!mongoose.Types.ObjectId.isValid(validatedEmployeeID)) {
      return res.status(400).json({ message: "Invalid employee ID" });
    }

    // Check if the referenced Product exists
    const product = await Product.findById(validatedProductID);
    if (!product) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    // Check if the referenced Employee exists
    const employee = await Employee.findById(validatedEmployeeID);
    if (!employee) {
      return res.status(400).json({ message: "Invalid employee ID" });
    }

    // Create a new loan
    const loan = new Loan({
      loanID,
      productID: validatedProductID,
      employeeID: validatedEmployeeID,
      loanDate,
      returnDate,
      status,
    });

    const savedLoan = await loan.save();
    res.status(201).json(savedLoan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateLoan = async (req, res) => {
  try {
    const loanId = req.body._id;

    // Check if the loan exists
    const loan = await Loan.findById(loanId);
    if (!loan) {
      return res.status(404).json({ message: "loan not found" });
    }

    // Define a Joi schema for validation
    const schema = Joi.object({
      productID: Joi.string().optional(),
      employeeID: Joi.string().optional(),
      loanDate: Joi.date().min(1).optional(),
      // price: Joi.number().min(1).optional(),
      returnDate: Joi.date().optional(),
      status: Joi.string().valid("Borrowed", "Returned", "Overdue").optional(),
    }).min(1); // At least one field is required

    // Validate the request body against the schema
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      allowUnknown: true,
    });

    if (error) {
      const errorMessage = error.details
        .map((detail) => detail.message)
        .join("; ");
      return res.status(400).json({ message: errorMessage });
    }

    const { productID, employeeID, loanDate, returnDate, status } = value;

    if (productID && !mongoose.Types.ObjectId.isValid(productID)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    if (employeeID && !mongoose.Types.ObjectId.isValid(employeeID)) {
      return res.status(400).json({ message: "Invalid employee ID" });
    }

    // Check if the referenced Product exists
    if (productID) {
      const product = await Product.findById(productID);
      if (!product) {
        return res.status(400).json({ message: "Invalid product ID" });
      }
    }

    // Check if the referenced Employee exists
    if (employeeID) {
      const employee = await Employee.findById(validatedEmployeeID);
      if (!employee) {
        return res.status(400).json({ message: "Invalid employee ID" });
      }
    }
    loan && loan.status === "Borrowed"
      ? (loan.status = "Returned")
      : (loan.status = "Borrowed");
    // Update the order fields
    Object.keys(value).forEach((key) => {
      loan[key] = value[key];
    });

    const updatedLoan = await loan.save();
    res.json(updatedLoan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllLoans = async (req, res) => {
  try {
    const loans = await Loan.find();
    const products = await Product.find();
    const employees = await Employee.find();
    const populatedLoans = loans.map((loan) => {
      const product = products.find(
        (pro) => pro._id.toString() === loan.productID.toString()
      );
      const employee = employees.find(
        (emp) => emp._id.toString() === loan.employeeID.toString()
      );

      if (loan && employee) {
        return {
          ...loan.toObject(),
          product: product.toObject(),
          employee: employee.toObject(),
        };
      }

      return loan.toObject();
    });

    res.json(populatedLoans);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const deleteLoan = async (req, res) => {
  try {
    const loanID = req.body.id;

    const loan = await Loan.findByIdAndDelete(loanID);

    res.json({ message: "loan deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getLoanById = async (req, res) => {
  try {
    const loanId = req.params.id;

    const loan = await Loan.findById(loanId);
    if (!loan) {
      return res.status(404).json({ message: "loan not found" });
    }

    res.json(loan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createLoan,
  getLoanById,
  getAllLoans,
  deleteLoan,
  updateLoan,
};
