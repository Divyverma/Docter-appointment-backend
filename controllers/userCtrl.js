const express = require("express");
const userModel = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const docterModel = require("../models/docterModel");
const appointmentModel = require("../models/appointmentModel");
const moment = require('moment')


// for registration
const registerController = async (req, res) => {
  try {
    const existingUser = await userModel.findOne({ email: req.body.email });
    if (existingUser) {
      return res
        .status(200)
        .send({ success: false, message: "User already exists" });
    }
    const password = req.body.password;
    const hashedPassword = await bcrypt.hash(password, 10);
    req.body.password = hashedPassword;
    const newUser = new userModel(req.body);
    await newUser.save();

    res.status(201).send({ message: "Registered successfully", success: true });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: `registor controller ${error.message}`,
    });
  }
};

//for login
const loginController = async (req, res) => {
  try {
    const user = await userModel.findOne({ email: req.body.email });
    if (!user) {
      return res.send(200).send({ message: "User not found", success: false });
    }
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res
        .status(200)
        .send({ message: "Invalid Email or Password", success: false });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.status(200).send({ message: "Login Success", success: true, token });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ message: `Error in login controller ${error.message}` });
  }
};

//middleware for get user data
const authController = async (req, res) => {
  try {
    const user = await userModel.findById({ _id: req.body.userId });
    user.password = undefined;
    if (!user) {
      return res.status(200).send({
        message: "user not found",
        success: false,
      });
    } else {
      res.status(200).send({
        success: true,
        data: user,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: `catch Block: auth error: ${error.message}`,
      success: false,
      error,
    });
  }
};


// for applying as a doctor
const applyDocterController = async (req, res) => {
  try {
    const newDoctor = await docterModel({ ...req.body, status: "pending" });
    await newDoctor.save();
    const adminUser = await userModel.findOne({ isAdmin: true });
    const notification = adminUser.notification;
    notification.push({
      type: "apply-doctor-request",
      message: `${newDoctor.firstName} ${newDoctor.lastName} has applied for a Docter Account`,
      data: {
        doctorId: newDoctor._id,
        name: newDoctor.firstName + " " + newDoctor.lastName,
        onClickPath: "/admin/doctors",
      },
    });
    await userModel.findByIdAndUpdate(adminUser._id, { notification });
    res.status(201).send({
      success: true,
      message: "Doctor account applied successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while applying for docter",
    });
  }
};



// for getting notification
const getAllNotificationController = async (req, res) => {
  try {
    const user = await userModel.findOne({ _id: req.body.userId });
    const seennotification = user.seennotification;
    const notification = user.notification;
    seennotification.push(...notification);
    user.notification = [];
    user.seennotification = notification;
    const updateUser = await user.save();
    res.status(200).send({
      success: true,
      message: "All notification marked as read",
      data: updateUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error in notification",
      success: false,
      error,
    });
  }
};



//for deleting notification
const deleteAllNotificationController = async (req, res) => {
  try {
    const user = await userModel.findOne({ _id: req.body.userId });
    user.notification = [];
    user.seennotification = [];
    const updateUser = await user.save();
    // updateUser.password = undefined;
    res.status(200).send({
      success: true,
      message: "All notification deleted",
      data: updateUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "unable to delete all notifications",
      error,
    });
  }
};



// for getting all doctor on home page
const getAllDoctorsController = async (req, res) => {
  try{
    const doctors = await docterModel.find({status:'approved'})
    res.status(200).send({
      success:true,
      message:"Doctors lists fetched successfully",
      data:doctors,
    })
  }catch(error){
    console.log(error);
    res.status(500).send({
      success:false,
      error,
      message:"Error while fetching doctor data"
    })
  }
};



//for booking an appointment
const bookAppointmentController=async(req, res)=>{
  try{
    req.body.date = moment(req.body.date, 'DD-MM-YYYY').toISOString()
    req.body.time = moment(req.body.time, 'HH:mm').toISOString()
    req.body.status='pending'
    const newAppointment = new appointmentModel(req.body)
    await newAppointment.save();
    const user = await userModel.findOne({_id:req.body.doctorInfo.userId})
    user.notification.push({
      type:'New-appointment-request',
      message:`A new Appointment request from ${req.body.userInfo.name}`,
      onClickPath:"/user/appointments"
    })
    await user.save();
    res.status(200).send({
      success:true,
      message:"Appointment booked successfully",
    })
  }catch(error){
    console.log(error)
    res.status(500).send({
      success:false,
      error,
      message:"Error while booking appointment"
    })
  }
}


const bookingAvailbilityController=async(req, res)=>{
  try {
    const date = moment(req.body.date, 'DD-MM-YYYY').toISOString()
    const fromTime = moment(req.body.time, 'HH:mm').subtract(1, 'hours').toISOString()
    const toTime = moment(req.body.time, 'HH:mm').add(1, 'hours').toISOString()
    const doctorId = req.body.doctorId
    const appointments = await appointmentModel.find({doctorId,
      date,
      time:{
        $gte:fromTime,
        $lte:toTime
      }
    })
    if(appointments.length > 0){
      return res.status(200).send({
        message:"Appointments not available at this time",
        success:true,
      })
    }else{
      return res.status(200).send({
        success:true,
        message:"Appointment available"
      })
    }
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success:false,
      message:"Error while checking booking availbility",
      error,
    })
  }
}

module.exports = {
  loginController,
  registerController,
  authController,
  applyDocterController,
  getAllNotificationController,
  deleteAllNotificationController,
  getAllDoctorsController,
  bookAppointmentController,
  bookingAvailbilityController,
};
