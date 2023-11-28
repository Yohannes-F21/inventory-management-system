const express = require("express");
const router = express.Router();
const supplierController = require("../controllers/supplierController");

// Supplier route
router.post("/supplier", supplierController.createSupplier);
router.get("/supplier", supplierController.getAllSupplier);
router.get("/supplier/:id", supplierController.getSupplierById);
router.put("/supplier", supplierController.updateSupplier);
router.post("/supplier/delete", supplierController.deleteSupplier);

module.exports = router;
