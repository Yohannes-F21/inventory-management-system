const express = require("express");
const router = express.Router();
const loanController = require("../controllers/loanController");

// Loan route
router.post("/loan", loanController.createLoan);
router.get("/loan", loanController.getAllLoans);
router.get("/loan/:id", loanController.getLoanById);
router.put("/loan", loanController.updateLoan);
router.post("/loan/delete", loanController.deleteLoan);

module.exports = router;
