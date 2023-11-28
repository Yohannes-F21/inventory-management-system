const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");

// Product route
router.post("/product", productController.createProduct);
router.get("/product", productController.getAllProduct);
router.get("/product/:id", productController.getProductById);
router.put("/product", productController.updateProduct);
router.post("/product/delete", productController.deleteProduct);

module.exports = router;
