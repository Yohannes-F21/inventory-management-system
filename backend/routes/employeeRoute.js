const express = require("express");
const router = express.Router();
const employeeController = require("../controllers/employeeController");

// Employee route
router.post("/employee", employeeController.createEmployee);
router.get("/employee", employeeController.getAllEmployee);
router.get("/employee/:id", employeeController.getEmployeeById);
router.put("/employee", employeeController.updateEmployee);
router.delete("/employee", employeeController.deleteEmployee);

module.exports = router;
