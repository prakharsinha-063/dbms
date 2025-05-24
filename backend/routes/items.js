const express = require("express");
const Item = require("../models/Item");
const authMiddleware = require("../middleware/auth");
const validateItem = require("../middleware/validate");
const router = express.Router();

// Create Item (Authenticated)
router.post("/", authMiddleware, validateItem, async (req, res) => {
  const {
    productName,
    sellerDescription,
    price,
    imageLink,
    location,
    contactDetails,
    category,
  } = req.body;
  try {
    const item = new Item({
      productName,
      sellerDescription,
      price,
      imageLink,
      location,
      contactDetails,
      category,
      seller: req.user.id,
    });
    await item.save();
    res.status(201).json({ message: "Item created successfully", item });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// List All Items with Search and Filter
router.get("/", async (req, res) => {
  try {
    const { search, location, minPrice, maxPrice, category } = req.query;
    const query = {};

    if (search) {
      query.productName = { $regex: search, $options: "i" };
    }
    if (location) {
      query.location = { $regex: location, $options: "i" };
    }
    if (minPrice) {
      query.price = { ...query.price, $gte: Number(minPrice) };
    }
    if (maxPrice) {
      query.price = { ...query.price, $lte: Number(maxPrice) };
    }
    if (category) {
      query.category = category;
    }

    const items = await Item.find(query).populate("seller", "name email");
    res.status(200).json(items);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Get Item by ID
router.get("/:id", async (req, res) => {
  try {
    const item = await Item.findById(req.params.id).populate(
      "seller",
      "name email"
    );
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }
    res.status(200).json(item);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
