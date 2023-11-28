const Joi = require("joi");
const Employee = require("../models/employee");
const Loan = require("../models/loan");

const mongoose = require("mongoose");

async function generateEmployeeID() {
  try {
    const lastEmployee = await Employee.findOne({}, "employeeID hiredDate")
      .sort({ employeeID: -1, hiredDate: -1 })
      .exec();

    let nextEmployeeID;

    if (lastEmployee && lastEmployee.employeeID) {
      // Extract the numeric portion of the employeeID
      const lastEmployeeID = lastEmployee.employeeID;
      const numericPart = lastEmployeeID.slice(4); // Remove "EMP" prefix
      const lastNumericID = parseInt(numericPart, 10);

      // Increment the numeric part by one
      const nextNumericID = lastNumericID + 1;

      // Pad the numeric part with leading zeros
      const paddedNumericID = nextNumericID.toString().padStart(3, "0");

      // Construct the new employeeID with the prefix and padded numeric part
      nextEmployeeID = `EMP-${paddedNumericID}`;
    } else {
      // If no employee found, start with EMP001
      nextEmployeeID = "EMP-001";
    }

    // Use the nextEmployeeID as needed
    return nextEmployeeID;
  } catch (error) {
    // Handle the error
    console.error(error);
    throw error;
  }
}

const createEmployee = async (req, res) => {
  try {
    const employeeID = await generateEmployeeID();
    const { firstName, lastName, gender, email, phone, hiredDate } = req.body;

    // Define a Joi schema for validation
    const schema = Joi.object({
      //employeeID: Joi.string().required(),
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      gender: Joi.string().required(),
      email: Joi.string().required(),
      phone: Joi.string().required(),
      hiredDate: Joi.date().required(),
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

    // Create a new Employee
    const employee = new Employee({
      employeeID,
      firstName,
      lastName,
      gender,
      email,
      phone,
      hiredDate,
    });

    const savedEmployee = await employee.save();
    res.status(201).json(savedEmployee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateEmployee = async (req, res) => {
  try {
    const id = req.body._id;

    // Check if the Catagory exists
    const employee = await Employee.findById(id);
    if (!employee) {
      return res.status(404).json({ message: "employee not found" });
    }

    // Define a Joi schema for validation
    const schema = Joi.object({
      firstName: Joi.string(),
      lastName: Joi.string(),
      gender: Joi.string(),
      email: Joi.string(),
      phone: Joi.string(),
      hiredDate: Joi.date(),
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

    // Update the Catagory fields
    Object.keys(value).forEach((key) => {
      employee[key] = value[key];
    });

    const updatedEmployee = await employee.save();
    res.json(updatedEmployee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllEmployee = async (req, res) => {
  try {
    const employees = await Employee.find().sort({ hiredDate: -1 });
    // const suppliers = await Supplier.find();
    //onst products = await Product.find();
    const loans = await Loan.find();
    const populatedEmployee = employees.map((employee) => {
      const empLoans = loans.filter(
        (loan) => loan.employeeID.toString() === employee._id.toString()
      );
      console.log(empLoans); // Assuming employeeID is the unique field for loan
      if (empLoans) {
        return {
          ...employee.toObject(),
          loans: empLoans,
        };
      }
      return employee.toObject();
    });
    console.log(populatedEmployee);
    res.json(populatedEmployee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteEmployee = async (req, res) => {
  try {
    const { _id } = req.body;

    const employee = await Employee.findOneAndDelete(_id);
    if (!employee) {
      return res.status(404).json({ message: "employee not found" });
    }
    res.json({ message: "employee deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getEmployeeById = async (req, res) => {
  try {
    const employeeId = req.params.id;

    const employee = await Employee.findById(catagoryId);
    if (!employee) {
      return res.status(404).json({ message: "employee not found" });
    }

    res.json(employee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createEmployee,
  getEmployeeById,
  getAllEmployee,
  deleteEmployee,
  updateEmployee,
};
