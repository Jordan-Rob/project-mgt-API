const mongoose = require('mongoose')

const connectDB = async () => {
    const conn = await mongoose.connect(process.env.MONGO_URI_DEV)

    console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline.bold)
} 

module.exports = connectDB