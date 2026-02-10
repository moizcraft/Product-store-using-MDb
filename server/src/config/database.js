const mongoose = require('mongoose');


const connectDB = async () => {
    await mongoose.connect(`mongodb+srv://${process.env.DbUserName}:${process.env.DbPassword}@cluster3.m0d4qqk.mongodb.net/${process.env.DbName}`)
}


module.exports = connectDB;