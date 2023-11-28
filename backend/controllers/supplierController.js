const Joi = require("joi");
const Supplier = require("../models/supplier");
const mongoose = require("mongoose");

async function generateSupplierID() {
  try {
    const lastSupplier = await Supplier.findOne({}, "supplierID registerDate")
      .sort({ supplierID: -1, registerDate: -1 })
      .exec();

    let nextSupplierID;

    if (lastSupplier && lastSupplier.supplierID) {
      // Extract the numeric portion of the employeeID
      const lastSupplierID = lastSupplier.supplierID;
      const numericPart = lastSupplierID.slice(5); // Remove "EMP" prefix
      const lastNumericID = parseInt(numericPart, 10);

      // Increment the numeric part by one
      const nextNumericID = lastNumericID + 1;

      // Pad the numeric part with leading zeros
      const paddedNumericID = nextNumericID.toString().padStart(3, "0");

      // Construct the new employeeID with the prefix and padded numeric part
      nextSupplierID = `SUPP-${paddedNumericID}`;
    } else {
      // If no employee found, start with EMP001
      nextSupplierID = "SUPP-001";
    }

    // Use the nextEmployeeID as needed
    return nextSupplierID;
  } catch (error) {
    // Handle the error
    console.error(error);
    throw error;
  }
}

const createSupplier = async (req, res) => {
  const supplierID = await generateSupplierID();
  try {
    const { supplierName, address, phone, email, registerDate } = req.body;

    // Define a Joi schema for validation
    const schema = Joi.object({
      supplierName: Joi.string().required(),
      address: Joi.string().required(),
      phone: Joi.number().required().min(1),
      email: Joi.string().required(),
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

    // const { productID: validatedProductID, employeeID: validatedEmployeeID } =
    //   value;

    // if (!mongoose.Types.ObjectId.isValid(validatedProductID)) {
    //   return res.status(400).json({ message: "Invalid product ID" });
    // }

    // if (!mongoose.Types.ObjectId.isValid(validatedEmployeeID)) {
    //   return res.status(400).json({ message: "Invalid employee ID" });
    // }

    // // Check if the referenced Product exists
    // const product = await Product.findById(validatedProductID);
    // if (!product) {
    //   return res.status(400).json({ message: "Invalid product ID" });
    // }

    // // Check if the referenced Employee exists
    // const employee = await Employee.findById(validatedEmployeeID);
    // if (!employee) {
    //   return res.status(400).json({ message: "Invalid employee ID" });
    // }

    // Create a new supplier
    const supplier = new Supplier({
      supplierID,
      supplierName,
      address,
      phone,
      email,
      registerDate,
    });

    const savedSupplier = await supplier.save();
    res.status(201).json(savedSupplier);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateSupplier = async (req, res) => {
  try {
    const supplierID = req.body.key;

    // Check if the supplier exists
    const supplier = await Supplier.findById(supplierID);
    if (!supplier) {
      return res.status(404).json({ message: "supplier not found" });
    }

    // Define a Joi schema for validation
    const schema = Joi.object({
      supplieryName: Joi.string().min(1),
      address: Joi.string().min(1),
      phone: Joi.number().min(1),
      email: Joi.string().min(1),
      registerDate: Joi.date().min(1),
    }).min(1); // At least one field is required

    // Validate the request body against the schema
    const { error, value } = schema.validate(req.body.formData, {
      abortEarly: false,
      allowUnknown: true,
    });

    if (error) {
      const errorMessage = error.details
        .map((detail) => detail.message)
        .join("; ");
      return res.status(400).json({ message: errorMessage });
    }

    // const { productID, employeeID, loanDate, returnDate, status } = value;

    // if (productID && !mongoose.Types.ObjectId.isValid(productID)) {
    //   return res.status(400).json({ message: "Invalid product ID" });
    // }

    // if (employeeID && !mongoose.Types.ObjectId.isValid(employeeID)) {
    //   return res.status(400).json({ message: "Invalid employee ID" });
    // }

    // // Check if the referenced Product exists
    // if (productID) {
    //   const product = await Product.findById(productID);
    //   if (!product) {
    //     return res.status(400).json({ message: "Invalid product ID" });
    //   }
    // }

    // // Check if the referenced Employee exists
    // if (employeeID) {
    //   const employee = await Employee.findById(validatedEmployeeID);
    //   if (!employee) {
    //     return res.status(400).json({ message: "Invalid employee ID" });
    //   }
    // }

    // Update the Catagory fields
    Object.keys(value).forEach((key) => {
      supplier[key] = value[key];
    });

    const updatedSupplier = await supplier.save();
    res.json(updatedSupplier);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.find();
    res.json(supplier);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteSupplier = async (req, res) => {
  try {
    const supplierID = req.body.id;
    console.log(supplierID);
    const supplier = await Supplier.findByIdAndDelete(supplierID);
    if (!supplier) {
      return res.json({ message: "supplier not found" });
    }

    res.json({ message: "supplier deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getSupplierById = async (req, res) => {
  try {
    const supplierId = req.params.id;

    const supplier = await Supplier.findById(supplierId);
    if (!supplier) {
      return res.status(404).json({ message: "supplier not found" });
    }

    res.json(supplier);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createSupplier,
  getSupplierById,
  getAllSupplier,
  deleteSupplier,
  updateSupplier,
};
