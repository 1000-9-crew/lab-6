const express = require('express');
const router = express.Router();

router.use("/auth", require("./authRouter"));
router.use("/student", require("./studentRouter"));
router.use("/teacher", require("./teacherRouter"));

module.exports = router;