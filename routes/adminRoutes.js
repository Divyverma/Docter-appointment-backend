const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const {
  getAllUsersController,
  getAllDoctorsController,
  changeAcountStatusController,
} = require("../controllers/adminCtrl");

const router = express.Router();

router.get("/getAllUser", authMiddleware, getAllUsersController);
router.get("/getAllDoctors", authMiddleware, getAllDoctorsController);
router.post("/changeAccountStatus", authMiddleware, changeAcountStatusController);

module.exports = router;
