const express = require("express");
const {
  loginController,
  registerController,
  authController,
  applyDocterController,
  getAllNotificationController,
  deleteAllNotificationController,
  getAllDoctorsController,
  bookAppointmentController,
  bookingAvailbilityController,
} = require("../controllers/userCtrl");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/login", loginController);
router.post("/register", registerController);
router.post("/getUserData", authMiddleware, authController); // for checking the jwt token
router.post("/apply-docter", authMiddleware, applyDocterController);
router.post(
  "/get-all-notification",
  authMiddleware,
  getAllNotificationController
);
router.post(
  "/delete-all-notification",
  authMiddleware,
  deleteAllNotificationController
);
router.get("/getAllDoctors", authMiddleware, getAllDoctorsController);
router.post('/book-appointment', authMiddleware, bookAppointmentController)
router.post('/booking-availbility', authMiddleware, bookingAvailbilityController)

module.exports = router;
