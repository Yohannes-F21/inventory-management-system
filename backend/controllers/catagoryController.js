const Joi = require("joi");
const Catagory = require("../models/catagory");
const mongoose = require("mongoose");

async function generateCatagoryID() {
  try {
    const lastCatagory = await Catagory.findOne({}, "catagoryID registerDate")
      .sort({ catagoryID: -1, registerDate: -1 })
      .exec();

    let nextCatagoryID;

    if (lastCatagory && lastCatagory.catagoryID) {
      // Extract the numeric portion of the employeeID
      const lastCatagoryID = lastCatagory.catagoryID;
      const numericPart = lastCatagoryID.slice(4); // Remove "EMP" prefix
      const lastNumericID = parseInt(numericPart, 10);

      // Increment the numeric part by one
      const nextNumericID = lastNumericID + 1;

      // Pad the numeric part with leading zeros
      const paddedNumericID = nextNumericID.toString().padStart(3, "0");

      // Construct the new employeeID with the prefix and padded numeric part
      nextCatagoryID = `CAT-${paddedNumericID}`;
    } else {
      // If no employee found, start with EMP001
      nextCatagoryID = "CAT-001";
    }

    // Use the nextEmployeeID as needed
    return nextCatagoryID;
  } catch (error) {
    // Handle the error
    console.error(error);
    throw error;
  }
}

const createCatagory = async (req, res) => {
  const catagoryID = await generateCatagoryID();
  try {
    const { catagoryName, description, registerDate } = req.body;

    // Define a Joi schema for validation
    const schema = Joi.object({
      catagoryName: Joi.string().required(),
      description: Joi.string().required(),
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

    // Create a new Catagory
    const catagory = new Catagory({
      catagoryID,
      catagoryName,
      description,
      registerDate,
    });

    const savedCatagory = await catagory.save();
    res.status(201).json(savedCatagory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateCatagory = async (req, res) => {
  try {
    const id = req.body.key;

    // Check if the Catagory exists
    const catagory = await Catagory.findById(id);
    if (!catagory) {
      return res.status(404).json({ message: "catagory not found" });
    }

    // Define a Joi schema for validation
    const schema = Joi.object({
      catagoryName: Joi.string(),
      description: Joi.string(),
      registerDate: Joi.date(),
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
      catagory[key] = value[key];
    });

    const updatedCatagory = await catagory.save();
    res.json(updatedCatagory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllCatagories = async (req, res) => {
  try {
    const catagories = await Catagory.find();
    // const suppliers = await Supplier.find();
    //onst products = await Product.find();
    const populatedCatagories = catagories.map((catagory) => {
      // const supplier = suppliers.find(
      //   (sup) => sup._id.toString() === order.supplierID.toString()
      // );
      // const product = products.find(
      //   (prod) => prod._id.toString() === order.productID.toString()
      // );
      // if (supplier && product) {
      // return {
      //   ...catagory.toObject(),
      //   // supplier: supplier.toObject(),
      //   // product: product.toObject(),
      // };
      //}

      return catagory.toObject();
    });

    res.json(populatedCatagories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteCatagory = async (req, res) => {
  try {
    const { id } = req.body;

    // console.log(id);
    const catagory = await Catagory.findByIdAndDelete(id);
    if (!catagory) {
      return res.status(404).json({ message: "catagory not found" });
    }
    res.json({ message: "catagory deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCatagoryById = async (req, res) => {
  try {
    const catagoryId = req.params.id;

    const catagory = await Catagory.findById(catagoryId);
    if (!catagory) {
      return res.status(404).json({ message: "catagory not found" });
    }

    res.json(catagory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createCatagory,
  getCatagoryById,
  getAllCatagories,
  deleteCatagory,
  updateCatagory,
};
