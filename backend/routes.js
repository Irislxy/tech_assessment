const express = require("express")
const router = express.Router()
const multer = require("multer")
const upload = multer({ dest: "uploads/" })

const userController = require("./controllers/userController")

router.post("/upload", upload.single("csvFile"), userController.uploadCSV) // Route to handle CSV upload
router.post("/getRecords", userController.getRecords) // Route to get records

module.exports = router
