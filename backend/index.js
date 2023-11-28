const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false, limit: "10mb" }));

const corsOptions = require("./config/corsOptions");

app.use(cors(corsOptions));

const orderRoute = require("./routes/orderRoute");
const supplierRoute = require("./routes/supplierRoute");
const loanRoute = require("./routes/loanRoute");
const catagoryRoute = require("./routes/catagoryRoute");
const productRoute = require("./routes/productRoute");
const employeeRoute = require("./routes/employeeRoute");

const PORT = process.env.PORT || 3500;

app.use(orderRoute);
app.use(supplierRoute);
app.use(loanRoute);
app.use(catagoryRoute);
app.use(productRoute);
app.use(employeeRoute);

mongoose
  .connect(
    "mongodb+srv://admin:admin1234@cluster0.doawadg.mongodb.net/Inv?retryWrites=true&w=majority"
  )
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server Running on Port ${PORT}`);
    });
  })
  .catch((err) => console.log(err));
