const { body, validationResult } = require("express-validator");

const validateItem = [
  body("productName").notEmpty().withMessage("Product name is required"),
  body("sellerDescription").notEmpty().withMessage("Description is required"),
  body("price")
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number"),
  body("imageLink").isURL().withMessage("Image link must be a valid URL"),
  body("location").notEmpty().withMessage("Location is required"),
  body("contactDetails")
    .matches(/^(?:\S+@\S+\.\S+|\+?\d{10,})$/)
    .withMessage("Contact details must be a valid email or phone number"),
  body("category")
    .isIn(["Electronics", "Batteries", "Appliances", "Other"])
    .withMessage("Invalid category"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

module.exports = validateItem;
