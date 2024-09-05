const mongoose = require('mongoose')
const colors = require('colors')

const connectDb=async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URL)
        console.log(`database connected`.bgGreen.white)
    } catch (error) {
        console.log(`connection error ${error.message}`.bgRed.white)
    }
}

module.exports = connectDb;