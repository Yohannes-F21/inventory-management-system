const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");

// Order route
router.post("/order", orderController.createOrder);
router.get("/order", orderController.getAllOrders);
router.get("/order/:id", orderController.getOrderById);
router.put("/order", orderController.updateOrder);
router.post("/order/delete", orderController.deleteOrder);

module.exports = router;
