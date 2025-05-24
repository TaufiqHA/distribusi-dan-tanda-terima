const express = require("express");
const router = express.Router();
const controller = require("../controllers/distributionController");

// Input distribusi
router.post("/", controller.createDistribution);

// Get tanda terima berdasarkan token
router.get("/:token", controller.getReceiptByToken);

// Submit tanda terima
router.post("/submit/:token", controller.submitReceipt);

module.exports = router;
