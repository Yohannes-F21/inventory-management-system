const express = require("express");
const router = express.Router();
const catagoryController = require("../controllers/catagoryController");

// Catagory route
router.post("/catagory", catagoryController.createCatagory);
router.get("/catagory", catagoryController.getAllCatagories);
router.get("/catagory/:id", catagoryController.getCatagoryById);
router.put("/catagory", catagoryController.updateCatagory);
router.post("/catagory/delete", catagoryController.deleteCatagory);

module.exports = router;
