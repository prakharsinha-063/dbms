const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  productName: { type: String, required: true },
  sellerDescription: { type: String, required: true },
  price: { type: Number, required: true },
  imageLink: { type: String, required: true },
  location: { type: String, required: true },
  contactDetails: { type: String, required: true },
  category: {
    type: String,
    required: true,
    enum: ["Electronics", "Batteries", "Appliances", "Other"],
    default: "Other",
  },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Item", itemSchema);
