const { Router } = require("express");
const authController = require("./authmain");
const authMiddleware = require("./authreq");
const router = Router();
const myenv = require('dotenv');
const jtoken = require('jsonwebtoken');



myenv.config({ path: 'config.env' });

const PORT = process.env.PORT || 3000;


router.post("/signup", authController.signup);
router.post("/signin", authController.signin);


module.exports = router;
