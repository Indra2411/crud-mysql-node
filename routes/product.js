const express = require("express");
const router = express.Router();
const db = require("../db");

const tableName = "crud";
const productIdColumnName = "product_Id";
const productColumnName = "product_Name";
const categoryIdColumnName = "category_Id";
const categoryColumnName = "category_Name";

// Create a new product
router.post("/", (req, res) => {
  const { name, categoryName, categoryId } = req.body;
  const query = `INSERT INTO ${tableName} (${productColumnName}, ${categoryColumnName}, ${categoryIdColumnName}) VALUES (?, ?, ?)`;
  db.query(query, [name, categoryName, categoryId], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Error creating product" });
    }
    const productId = result.insertId;
    res.status(201).json({
      [productIdColumnName]: productId,
      [productColumnName]: name,
      [categoryColumnName]: categoryName,
      [categoryIdColumnName]: categoryId,
    });
  });
});



// Update a product
router.put("/:id", (req, res) => {
  const productId = req.params.id;
  const { name, categoryName, categoryId } = req.body;
  const query = `UPDATE ${tableName} SET ${productColumnName} = ?, ${categoryColumnName} = ?, ${categoryIdColumnName} = ? WHERE ${productIdColumnName} = ?`;
  db.query(
    query,
    [name, categoryName, categoryId, productId],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Error updating product" });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.json({
        [productIdColumnName]: productId,
        [productColumnName]: name,
        [categoryColumnName]: categoryName,
        [categoryIdColumnName]: categoryId,
      });
    }
  );
});

// Delete a product
router.delete("/:id", (req, res) => {
  const productId = req.params.id;
  const query = `DELETE FROM ${tableName} WHERE ${productIdColumnName} = ?`;
  db.query(query, [productId], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Error deleting product" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json({ message: "Product deleted" });
  });
});

// Read a single product
router.get("/:id", (req, res) => {
  const productId = req.params.id;
  const query = `SELECT * FROM ${tableName} WHERE ${productIdColumnName} = ?`;
  db.query(query, [productId], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Error fetching product" });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json(results[0]);
  });
});

// route for pagination
router.get("/", (req, res) => {
  const page = req.query.page || 1; // Current page number
  const limit = req.query.limit || 5; // Items to display per page
  const offset = (page - 1) * limit; // Offset for SQL query

  const query = `
    SELECT * FROM ${tableName}
    LIMIT ${limit} OFFSET ${offset}
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Error fetching products" });
    }

    // to calculate total pagesg
    const countQuery = `SELECT COUNT(*) AS total FROM ${tableName}`;
    db.query(countQuery, (err, countResult) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Error fetching product count" });
      }

      const totalProducts = countResult[0].total;
      const totalPages = Math.ceil(totalProducts / limit);

      res.json({ products: results, totalPages });
    });
  });
});
module.exports = router;
