const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const auth = require("../middleware/auth");

// Create an order
router.post("/", auth, async (req, res) => {
  try {
    const { itemId } = req.body;
    const order = new Order({
      buyer: req.user.id,
      item: itemId,
      purchaseDate: new Date(),
    });
    await order.save();
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get user's orders
router.get("/", auth, async (req, res) => {
  try {
    const orders = await Order.find({ buyer: req.user.id })
      .populate("item")
      .populate("buyer", "name");
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
