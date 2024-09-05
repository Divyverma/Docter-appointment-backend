const express = require('express')
const authMiddleware = require('../middlewares/authMiddleware');
const { getDoctorInfoController, updateProfileController, getDoctorByIdController } = require('../controllers/doctorctr');
const router = express.Router();


router.post('/getDoctorInfo', authMiddleware, getDoctorInfoController)
router.post('/updateProfile', authMiddleware, updateProfileController)
router.post('/getDoctorById', authMiddleware, getDoctorByIdController)



module.exports = router;