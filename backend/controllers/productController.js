const Joi = require("joi");
const Product = require("../models/product");
const Supplier = require("../models/supplier");
const Catagory = require("../models/catagory");
const mongoose = require("mongoose");

async function generateItemID() {
  try {
    const lastItem = await Product.findOne({}, "itemID registerDate")
      .sort({ itemID: -1, registerDate: -1 })
      .exec();

    let nextItemID;

    if (lastItem && lastItem.itemID) {
      // Extract the numeric portion of the employeeID
      const lastItemID = lastItem.itemID;
      const numericPart = lastItemID.slice(5); // Remove "EMP" prefix
      const lastNumericID = parseInt(numericPart, 10);

      // Increment the numeric part by one
      const nextNumericID = lastNumericID + 1;

      // Pad the numeric part with leading zeros
      const paddedNumericID = nextNumericID.toString().padStart(3, "0");

      // Construct the new employeeID with the prefix and padded numeric part
      nextItemID = `ITEM-${paddedNumericID}`;
    } else {
      // If no employee found, start with EMP001
      nextItemID = "ITEM-001";
    }

    // Use the nextEmployeeID as needed
    return nextItemID;
  } catch (error) {
    // Handle the error
    console.error(error);
    throw error;
  }
}

const createProduct = async (req, res) => {
  try {
    console.log(req.body);
    const itemID = await generateItemID();
    const {
      catagoryID,
      supplierID,
      productName,
      price,
      image,
      description,
      quantityOnHand,
      // reorderLevel,
      // registerDate,
    } = req.body;

    // Define a Joi schema for validation
    //console.log(req.body);
    const schema = Joi.object({
      catagoryID: Joi.string().required(),
      supplierID: Joi.string().required(),
      productName: Joi.string().required(),
      price: Joi.string().required(),
      image: Joi.string().optional(),
      description: Joi.string().required(),
      quantityOnHand: Joi.number().required(),
      // reorderLevel: Joi.number().required(),
      // registerDate: Joi.date().required(),
    });

    // Validate the request body against the schema
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      allowUnknow: true,
    });

    if (error) {
      const errorMessage = error.details
        .map((detail) => detail.message)
        .join("; ");
      return res.status(400).json({ message: errorMessage });
    }

    const { catagoryID: validatedCatagoryID, supplierID: validatedSupplierID } =
      value;

    if (!mongoose.Types.ObjectId.isValid(validatedCatagoryID)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    if (!mongoose.Types.ObjectId.isValid(validatedSupplierID)) {
      return res.status(400).json({ message: "Invalid supplier ID" });
    }

    // Check if the referenced Catagory exists
    const catagory = await Catagory.findById(validatedCatagoryID);
    if (!catagory) {
      return res.status(400).json({ message: "Invalid catagory ID" });
    }

    // Check if the referenced Supplier exists
    const supplier = await Supplier.findById(validatedSupplierID);
    if (!supplier) {
      return res.status(400).json({ message: "Invalid supplier ID" });
    }

    // Create a new order
    const product = new Product({
      itemID,
      catagoryID: validatedCatagoryID,
      supplierID: validatedSupplierID,
      productName,
      price,
      image,
      description,
      quantityOnHand,
      // reorderLevel,
      // registerDate,
    });

    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    console.log(req.body);
    const productId = req.body.key;

    // Check if the product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "product not found" });
    }

    // Define a Joi schema for validation
    const schema = Joi.object({
      catagoryID: Joi.string(),
      supplierID: Joi.string(),
      productName: Joi.string().min(1),
      price: Joi.string().required(),
      image: Joi.string().optional(),
      description: Joi.string().min(1),
      quantityOnHand: Joi.number().min(1),
      reorderLevel: Joi.number().min(1),
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

    const {
      catagoryID,
      supplierID,
      productName,
      price,
      image,
      description,
      quantityOnHand,
      reorderLevel,
      registerDate,
    } = value;

    if (catagoryID && !mongoose.Types.ObjectId.isValid(catagoryID)) {
      return res.status(400).json({ message: "Invalid catagory ID" });
    }

    if (supplierID && !mongoose.Types.ObjectId.isValid(supplierID)) {
      return res.status(400).json({ message: "Invalid supplier ID" });
    }

    // Check if the referenced catagory exists
    if (catagoryID) {
      const catagory = await Catagory.findById(catagoryID);
      if (!catagory) {
        return res.status(400).json({ message: "Invalid catagory ID" });
      }
    }

    // Check if the referenced supplier exists
    if (supplierID) {
      const supplier = await Supplier.findById(supplierID);
      if (!supplier) {
        return res.status(400).json({ message: "Invalid supplier ID" });
      }
    }

    // Update the order fields
    Object.keys(value).forEach((key) => {
      product[key] = value[key];
    });

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const getAllProduct = async (req, res) => {
  try {
    const products = await Product.find();
    const suppliers = await Supplier.find();
    const catagories = await Catagory.find();
    const populatedProducts = products.map((product) => {
      const supplier = suppliers.find(
        (sup) => sup._id.toString() === product.supplierID.toString()
      );
      const catagory = catagories.find(
        (cat) => cat._id.toString() === product.catagoryID.toString()
      );
      if (supplier && catagory) {
        return {
          ...product.toObject(),
          supplier: supplier.toObject(),
          catagory: catagory.toObject(),
        };
      }

      return product.toObject();
    });

    res.json(populatedProducts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const productId = req.body.id;
    console.log(productId);

    const product = await Product.findByIdAndDelete(productId);
    if (!product) {
      return res.json({ message: "product not found" });
    }
    res.json({ message: "product deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const productId = req.params.id;
    console.log(req.params);

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "product not found" });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createProduct,
  getProductById,
  getAllProduct,
  deleteProduct,
  updateProduct,
};
