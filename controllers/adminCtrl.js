const docterModel = require("../models/docterModel");
const userModel = require("../models/docterModel");

const getAllUsersController = async (req, res) => {
  try {
    const users = await userModel.find({});
    res.status(200).send({
      success: true,
      message: "User Data list",
      data: users,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while Fetching users",
      error,
    });
  }
};

const getAllDoctorsController = async (req, res) => {
  try {
    const doctors = await docterModel.find({});
    res.status(200).send({
      success: true,
      message: "Doctor Data list",
      data: doctors,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while Fetching Doctors",
      error,
    });
  }
};

const changeAcountStatusController = async (req, res) => {
  try {
    const {docterId, status} = req.body
    const doctor = await docterModel.findByIdAndUpdate(docterId, {status})
    const user = await userModel.findOne({_id:doctor.userId})
    const notification = user?.notification
    notification?.push({
      type:'doctor-account-request-updated',
      message:`Your Doctor Account Request Has Been ${status}`,
      onClickPath:'/notification'
    })
    user.isDocter = status === 'approved' ? true : false
    await user?.save()
    res.status(201).send({
      success: true,
      message:'Account Status updated',
      data: doctor
    })
  } catch (error) {
    console.log("catch error 59" ,error.message);
    res.status(500).send({
      success: false,
      message: "Error in Account Status",
      error,
    });
  }
};

module.exports = {
  getAllUsersController,
  getAllDoctorsController,
  changeAcountStatusController,
};
