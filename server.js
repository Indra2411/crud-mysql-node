const express = require("express");
const path = require("path");
const app = express();
const port = 1337;

// Middleware
app.use(express.json());

// Database connection
const db = require("./db");

// Routes
const productsRouter = require("./routes/product");
app.use("/api/products", productsRouter);

// Serve static files from the public directory
app.use(express.static("public"));

// app.get("/", (req, res) => {
//   res.sendFile(path.join(__dirname, "public", "pages", "product-list.html"));
// });

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
