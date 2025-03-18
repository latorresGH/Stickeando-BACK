const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadBackground");
const backgroundController = require("../controllers/backgroundController");

router.post("/background", upload.single("background"), backgroundController.uploadBackground);
router.get("/background", backgroundController.getBackground);
router.get("/backgrounds", backgroundController.getAllBackgrounds);


module.exports = router;
