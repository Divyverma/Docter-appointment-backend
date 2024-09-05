const mongoose = require("mongoose");

const docterSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
    },
    firstName: {
      type: String,
      required: [true, "Firstname is required"],
    },
    lastName: {
      type: String,
      required: [true, "Lastname is required"],
    },
    phone: {
      type: String,
      required: [true, "Phone no. is required"],
    },
    email: {
      type: String,
      required: [true, "email is required"],
    },
    website: {
      type: String,
    },
    address: {
      type: String,
      required: [true, "Adress is required"],
    },
    specialization: {
      type: String,
      required: [true, "specialiazation is required"],
    },
    experience: {
      type: String,
      required: [true, "experience is required"],
    },
    feesPerCusaltation: {
      type: Number,
      required: [true, "fee is required"],
    },
    status:{
        type:String,
        default:'pending'
    },
    timings: {
      type: Object,
      required: [true, "work timing is required"],
    },
  },
  { timestamps: true }
);

const docterModel = mongoose.model("docters", docterSchema);
module.exports = docterModel;
