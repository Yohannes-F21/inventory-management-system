const Joi = require("joi");
const Order = require("../models/order");
const Product = require("../models/product");
const Supplier = require("../models/supplier");
const mongoose = require("mongoose");

async function generateOrderID() {
  try {
    const lastOrder = await Order.findOne({}, "orderID orderDate")
      .sort({ orderID: -1, orderDate: -1 })
      .exec();

    let nextOrderID;

    if (lastOrder && lastOrder.orderID) {
      // Extract the numeric portion of the employeeID
      const lastOrderID = lastOrder.orderID;
      const numericPart = lastOrderID.slice(6); // Remove "EMP" prefix
      const lastNumericID = parseInt(numericPart, 10);

      // Increment the numeric part by one
      const nextNumericID = lastNumericID + 1;

      // Pad the numeric part with leading zeros
      const paddedNumericID = nextNumericID.toString().padStart(3, "0");

      // Construct the new employeeID with the prefix and padded numeric part
      nextOrderID = `ORDER-${paddedNumericID}`;
    } else {
      // If no employee found, start with EMP001
      nextOrderID = "ORDER-001";
    }

    // Use the nextEmployeeID as needed
    return nextOrderID;
  } catch (error) {
    // Handle the error
    console.error(error);
    throw error;
  }
}

const createOrder = async (req, res) => {
  const orderID = await generateOrderID();
  try {
    const {
      productID,
      supplierID,
      quantityOrdered,
      unitPrice,
      orderDate,
      deliveryDate,
      status,
    } = req.body;

    // Define a Joi schema for validation
    const schema = Joi.object({
      productID: Joi.string().required(),
      supplierID: Joi.string().required(),
      quantityOrdered: Joi.number().required(),
      unitPrice: Joi.number().required(),
      deliveryDate: Joi.date().required(),
      status: Joi.string().optional(),
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

    const { productID: validatedProductID, supplierID: validatedSupplierID } =
      value;

    if (!mongoose.Types.ObjectId.isValid(validatedProductID)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    if (!mongoose.Types.ObjectId.isValid(validatedSupplierID)) {
      return res.status(400).json({ message: "Invalid supplier ID" });
    }

    // Check if the referenced Product exists
    const product = await Product.findById(validatedProductID);
    if (!product) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    // Check if the referenced Supplier exists
    const supplier = await Supplier.findById(supplierID);
    if (!supplier) {
      return res.status(400).json({ message: "Invalid supplier ID" });
    }

    // Create a new order
    const order = new Order({
      orderID,
      productID: validatedProductID,
      supplierID: validatedSupplierID,
      quantityOrdered,
      unitPrice,
      orderDate,
      deliveryDate,
      status,
    });

    const savedOrder = await order.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateOrder = async (req, res) => {
  try {
    const orderID = req.body.key;

    // Check if the order exists
    const order = await Order.findById(orderID);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Define a Joi schema for validation
    const schema = Joi.object({
      productID: Joi.string(),
      supplierID: Joi.string(),
      quantityOrdered: Joi.number().min(1),
      unitPrice: Joi.number().min(1),
      orderDate: Joi.date().min(1),
      deliveryDate: Joi.date().min(1),
      status: Joi.string().valid("canceled", "delivered", "pending"),
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
      productID,
      supplierID,
      quantityOrdered,
      unitPrice,
      orderDate,
      deliveryDate,
      status,
    } = value;

    if (productID && !mongoose.Types.ObjectId.isValid(productID)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    if (supplierID && !mongoose.Types.ObjectId.isValid(supplierID)) {
      return res.status(400).json({ message: "Invalid supplier ID" });
    }

    // Check if the referenced Product exists
    if (productID) {
      const product = await Product.findById(productID);
      if (!product) {
        return res.status(400).json({ message: "Invalid product ID" });
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
      order[key] = value[key];
    });

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    const suppliers = await Supplier.find();
    const products = await Product.find();
    const populatedOrders = orders.map((order) => {
      const supplier = suppliers.find(
        (sup) => sup._id.toString() === order.supplierID.toString()
      );
      const product = products.find(
        (prod) => prod._id.toString() === order.productID.toString()
      );
      if (supplier && product) {
        return {
          ...order.toObject(),
          supplier: supplier.toObject(),
          product: product.toObject(),
        };
      }

      return order.toObject();
    });

    res.json(populatedOrders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteOrder = async (req, res) => {
  try {
    const orderId = req.body.id;

    const order = await Order.findByIdAndDelete(orderId);

    res.json({ message: "Order deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getOrderById = async (req, res) => {
  try {
    const orderId = req.params.id;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createOrder,
  getOrderById,
  getAllOrders,
  deleteOrder,
  updateOrder,
};
