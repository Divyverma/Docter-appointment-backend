const express = require('express')
const colors = require('colors')
const moragan = require('morgan')
const dotenv = require('dotenv')
const connectDb = require('./config/db')
const port = process.env.PORT || 8080


dotenv.config();
connectDb();

const app = express();
app.use(express.json())
app.use(moragan('dev'))


//routes
app.use('/api/v1/user', require('./routes/userRoutes'))
app.use('/api/v1/admin', require('./routes/adminRoutes'))
app.use('/api/v1/doctor', require('./routes/doctorRoutes'))

app.listen(port, ()=>{
    console.log(`Server is running in ${process.env.NODE_MODE} mode on port ${port}`.bgCyan.white)
})